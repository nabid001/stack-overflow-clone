"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { QuestionVoteParams } from "@/types/shared.types";

type CreateQuestionProps = {
  title: string;
  content: string;
  tags: string[];
  author: string
  path: string;
};

export const getQuestion = async () => {
    try {
      await connectToDatabase();
  
      const question = await Question.find()
        .populate({ path: "author", model: User })
        .populate({ path: "tags", model: Tag })
        .sort({ createdAt: -1 }); 
  
      return { question };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  

export const createQuestion = async ({ title, content, tags, author, path,
}: CreateQuestionProps) => {
  try {
    await connectToDatabase();

    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocument = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocument.push(existingTag);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocument } },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionById = async (id: string) => {
  try {
    await connectToDatabase();

    const question = await Question.findById(id)
      .populate({path: "author", model: User, select: "_id name clerkId username picture"})
      .populate({path: "tags", model: Tag, select: "_id name"})

    return {question}
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const upvoteQuestion = async ({questionId, userId, hasdownVoted, hasupVoted, path}: QuestionVoteParams ) => {
  try {
    await connectToDatabase();

    let updateQuery = {};

    if(hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId}
      }
    } else {
      updateQuery = { $addToSet: { upvotes: userId }};
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true
    })

    if(!question) {
      throw new Error("there is no question")
    }

    revalidatePath(path);

    return question
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const downvoteQuestion = async ({questionId, userId, hasdownVoted, hasupVoted, path}: QuestionVoteParams ) => {
  try {
    await connectToDatabase();

    let updateQuery = {};

    if(hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId}
      }
    } else {
      updateQuery = { $addToSet: { upvotes: userId }};
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true
    })

    if(!question) {
      throw new Error("there is no question")
    }

    revalidatePath(path);

    return question
  } catch (error) {
    console.log(error);
    throw error
  }
}