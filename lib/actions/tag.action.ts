"use server";

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "@/types/shared.types";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";

export const getAllTags = async () => {
  try {
    await connectToDatabase();

    const tags = await Tag.find();

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

export const getRelatedTags = async (tagId: string) => {
  try {
    await connectToDatabase();

    const tags = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
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

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
