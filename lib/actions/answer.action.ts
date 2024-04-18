"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import { AnswerVoteParams, DeleteAnswerParams, GetAnswersParams, GetUserStatsParams } from "@/types/shared.types";
import Interaction from "@/database/interactive.model";

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

export const getAnswerById = async ({questionId, page = 1, pageSize = 10}: GetAnswersParams) => {
  try {
    await connectToDatabase();

    const skipAmount = (page - 1) * pageSize;

    const answers = await Answer.find({question: questionId})
    .populate({
      path: "author",
      model: User,
      select: "_id name clerkId picture",
    })
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(pageSize);
  

    const totalAnswers = await Answer.countDocuments({question: questionId});
    const isNext = totalAnswers > skipAmount + answers.length;

    return {answers, isNext}
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAnswer = async ({answerId, userId, hasdownVoted, hasupVoted, path}: AnswerVoteParams) => {
  try {
    await connectToDatabase();
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

export const getUserAnswer = async ({userId, page = 1, pageSize = 20}: GetUserStatsParams) => {
  try {
    await connectToDatabase();

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const skip = (page - 1) * pageSize;

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: - 1 })
      .populate({ path: "author", model: User, select: "_id name clerkId name picture" })
      .populate({ path: "question", model: Question, select: "_id title" })
      .skip(skip)
      .limit(pageSize);

    const isNext = totalAnswers > skip + userAnswers.length;

    if(!userAnswers) {
      throw new Error("there is no answers")
    }

    return {totalAnswers, answers: userAnswers, isNext}
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteAnswer = async ({answerId, path}: DeleteAnswerParams) => {
  try {
    await connectToDatabase();

    const answer = await Answer.findById(answerId);

    if(!answer) {
      throw new Error("Answer not found")
    }

    await Answer.deleteOne({_id: answerId});
    await Question.updateMany({_id: answer.question}, { $pull: { answers: answerId } } );
    await Interaction.deleteMany({question: answerId})

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error
  }
}
