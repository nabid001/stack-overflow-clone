"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { DeleteQuestionParams, GetQuestionsParams, GetUserStatsParams, QuestionVoteParams } from "@/types/shared.types";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interactive.model";
import console from "console";
import { FilterQuery } from "mongoose";

type CreateQuestionProps = {
  title: string;
  content: string;
  tags: string[];
  author: string
  path: string;
};

type EditQuestionProps = {
  questionId: string;
  title: string;
  content: string;
  path: string;
};

export const getQuestion = async ({page = 1, pageSize = 20, searchQuery, filter }: GetQuestionsParams) => {
    try {
      await connectToDatabase();

      const skipAmount = (page - 1) * pageSize;

      let query: FilterQuery< typeof Question> = {}
      if(searchQuery) {
        query = {
          $or: [
            {title: {$regex: new RegExp(searchQuery, "i")} },
            {content: {$regex: new RegExp(searchQuery, "i")} }
          ]
        }
      }

      let sortOptions = {};
      switch (filter) {
        case "newest":
          sortOptions = { createdAt: -1 }
          break;
        case "frequent":
          sortOptions = { views: -1 }
          break;
        case "unanswered":
          query.answers = { $size: 0 }
          break;
        default:
          break;
      }
  
      const question = await Question.find(query)
        .populate({ path: "author", model: User })
        .populate({ path: "tags", model: Tag })
        .skip(skipAmount)
        .limit(pageSize)
        .sort(sortOptions)
  
      const totalQuestions = await Question.countDocuments(query);

      const isNext = totalQuestions > skipAmount + question.length;

      return { question, isNext };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
// reputation.
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

    await Interaction.create({
      user: author,
      action: "question",
      question: question._id,
      tags: tagDocument
    })

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } })

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
// reputation
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

    // if the user hasn't already voted then increase reputation by +1 or if the user remove the vote then decrease reputation by -1 
    // if(!hasupVoted) {
    //   await User.findByIdAndUpdate(
    //     userId,
    //     { $inc: { reputation: 1}},
    //     { new: true }
    //   )
    // } else if(hasupVoted) {
    //   await User.findByIdAndUpdate(
    //     userId,
    //     { $inc: { reputation: -1}},
    //     { new: true }
    //   )
    // }

    await User.findByIdAndUpdate(
      userId,
      { $inc: { reputation: hasupVoted ? -1 : 1 }},
    )
    
    // if the user receiving an upvote from another user then increase reputation by +10 or if the user remove the vote then decrease reputation by -10
    // if(!hasupVoted && userId !== question.author) {
    //   await User.findByIdAndUpdate(
    //     question.author,
    //     { $inc: { reputation: 10}},
    //     { new: true }
    //   )
    // } else if(hasupVoted && userId !== question.author) {
    //   await User.findByIdAndUpdate(
    //     question.author,
    //     { $inc: { reputation: -10}},
    //     { new: true }
    //   )
    // }

    await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasupVoted && userId !== question.author ? -10 : 10} })

    revalidatePath(path);

    return question
  } catch (error) {
    console.log(error);
    throw error
  }
}
// reputation
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
      updateQuery = { $addToSet: { downvotes: userId }};
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true
    })

    if(!question) {
      throw new Error("there is no question")
    }

    // if the user hasn't already down voted then increase reputation by -1 or if the user remove the vote then decrease reputation by 1 
    // if(!hasdownVoted) {
    //   await User.findByIdAndUpdate(
    //     userId,
    //     { $inc: { reputation: -1}},
    //     { new: true }
    //   )
    // } else if(hasdownVoted) {
    //   await User.findByIdAndUpdate(
    //     userId,
    //     { $inc: { reputation: 1}},
    //     { new: true }
    //   )
    // }
    await User.findByIdAndUpdate(
      userId,
      { $inc: { reputation: hasdownVoted ? 1 : -1 }},
    )

    // if the user receiving an down upvote from another user then increase reputation by -2 or if the user remove the vote then decrease reputation by 2
    // if(!hasdownVoted && userId !== question.author) {
    //   await User.findByIdAndUpdate(
    //     question.author,
    //     { $inc: { reputation: -2}},
    //     { new: true }
    //   )
    // } else if(hasdownVoted && userId !== question.author) {
    //   await User.findByIdAndUpdate(
    //     question.author,
    //     { $inc: { reputation: 2}},
    //     { new: true }
    //   )
    // }
    
    await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasdownVoted && userId !== question.author ? 2 : -2} })

    revalidatePath(path);

    return question
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const getQuestionByUserId = async ({userId, page = 1, pageSize = 20}: GetUserStatsParams) => {
  try {
    await connectToDatabase();

    const totalQuestions = await Question.countDocuments({ author: userId });

    const skip = (page - 1) * pageSize;

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1 , views: -1, upvotes: -1 })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({ path: "author", model: User, select: "_id name clerkId name picture" })
      .skip(skip)
      .limit(pageSize);

    const isNext = totalQuestions > skip + userQuestions.length;


    if(!userQuestions) {
      throw new Error("there is no question")
    }

    return {totalQuestions, questions: userQuestions, isNext}
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuestion = async ({questionId, path}: DeleteQuestionParams) => {
  try {
    await connectToDatabase();

    await Question.deleteOne({_id: questionId});

    await Answer.deleteMany({question: questionId})
    await Tag.updateMany({questions: questionId}, { $pull: { questions: questionId } } );
    await User.updateMany({saved: questionId}, { $pull: { saved: questionId } } );
    await Interaction.deleteMany({question: questionId})

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const editQuestion = async ({ questionId, title, content, path, }: EditQuestionProps) => {
  try {
    await connectToDatabase();

    const question = await Question.findById(questionId).populate("tags");

    if(!question) {
      throw new Error("Question not found");
    }

    await Question.findByIdAndUpdate(questionId, { title, content }, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getHotQuestions = async () => {
  try {
    await connectToDatabase();

    const question = await Question.find()
      .sort({views: - 1, upvotes: - 1 })
      .limit(5)
    
    return question
  } catch (error) {
    console.log(error);
    throw error;
  }
};
