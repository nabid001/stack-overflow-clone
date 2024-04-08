"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import { AnswerVoteParams, GetAnswersParams } from "@/types/shared.types";

type Props = {
  content: string;
  author: string;
  question: string;
  path: string;
};

export const createAnswer = async ({ content, author, question, path, }: Props) => {
  try {
    await connectToDatabase();

    const newAnswer = await Answer.create({ content, author, question,});

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswerById = async ({questionId,}: GetAnswersParams) => {
  try {
    await connectToDatabase();

    const answers = await Answer.find({question: questionId}).populate({
      path: "author",
      model: User,
      select: "_id name clerkId picture",
    })
    .sort({ createdAt: -1 });

    return {answers}
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAnswer = async ({answerId, userId, hasdownVoted, hasupVoted, path}: AnswerVoteParams) => {
  try {
    await connectToDatabase();
console.log(answerId);
    let updateQuery = {};

    if(hasupVoted) {
      updateQuery = { $pull: { upvotes: userId }}
    } else if(hasdownVoted){
      updateQuery = {
        $pull: { upvotes: userId},
        $push: { downvotes: userId}
      }
    } else {
      updateQuery = { $addToSet: { upvotes: userId}}
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    });

    if(!answer) {
      throw new Error("Answer not found")
    };

    revalidatePath(path);

    return answer
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const downvoteAnswer = async ({answerId, userId, hasdownVoted, hasupVoted, path}: AnswerVoteParams) => {
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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    });

    if(!answer) {
      throw new Error("Answer not found")
    };

    revalidatePath(path);

    return answer
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}
