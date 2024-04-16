"use server";

import Tag, { ITag } from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "@/types/shared.types";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";

export const getAllTags = async ({page = 1, pageSize = 20, searchQuery, filter}: GetAllTagsParams) => {
  try {
    await connectToDatabase();
    const pageSkip = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = searchQuery 
    ? { name: { $regex: new RegExp(searchQuery, 'i') } } 
    : { };

    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 }
        break;
      case "recent":
        sortOptions = { createdOn: -1 }
        break;
      case "name":
        sortOptions = { name: 1 }
        break;
      case "old":
        sortOptions = { createdOn: 1 }
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .limit(pageSize)
      .skip(pageSkip)
      .sort(sortOptions)

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const interactedTag = async ({ clerkId, }: GetTopInteractedTagsParams) => {
  try {
    await connectToDatabase();

    const user = await User.find({ clerkId });
    if (!user) throw new Error("User not found");

    const tags = await Tag.find().limit(3);

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionByTagId = async ({tagId, searchQuery}: GetQuestionsByTagIdParams) => {
  try {
    await connectToDatabase();

    const TagQuery: FilterQuery<ITag> = {
      _id: tagId,
    };

    const tags = await Tag.findById(TagQuery).populate({
      path: "questions",
      model: Question,
      match: searchQuery ?
      { title: { $regex: searchQuery, $options: "i" } } : {},
      populate: [
        {
          path: "author",
          model: User,
          select: "_id clerkId username picture name",
        },
        { path: "tags", model: Tag, select: "_id name" },
        { path: "answers", model: Answer },
      ],
    });

    if(!tags) throw new Error("Tag not found");

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopTags = async () => {
  try {
    await connectToDatabase();

    const tag = await Tag.aggregate([
      {$project: { name: 1, numberOfQuestions: { $size: "$questions"}}},
      { $sort: {numberOfQuestions : - 1}},
      { $limit: 5}
    ])
    
    return tag
  } catch (error) {
    console.log(error);
    throw error;
  }
};

