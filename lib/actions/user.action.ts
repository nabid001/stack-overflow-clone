"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "@/types/shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export const getUserById = async (clerkId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    return user
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });
    await Tag.updateMany(
      {},
      { $pull: { questions: { userQuestionIds }}}
    )

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAllUser = async ( { page = 1, pageSize = 20, filter, searchQuery }: GetAllUsersParams) => {
  try {
    await connectToDatabase();

    const skipPage = (page - 1) * pageSize;

    let query: FilterQuery<typeof User> = {}
    if(searchQuery) {
      query = {
        $or: [
          {username: {$regex: new RegExp(searchQuery, "i")} },
          {name: {$regex: new RegExp(searchQuery, "i")} }
        ]
      }
    }

    let sortOptions = {}
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: - 1 }
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 }
        break;
      case "top_contributors":
        sortOptions = { reputation: - 1 }
        break;
    }

    
    const users = await User.find(query)
    .sort(sortOptions)
    .skip(skipPage)
    .limit(pageSize)
    
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipPage + users.length

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if(!user) {
      throw new Error('User not found');
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if(isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(userId, 
        { $pull: { saved: questionId }},
        { new: true }
      )
    } else {
      // add question to saved
      await User.findByIdAndUpdate(userId, 
        { $addToSet: { saved: questionId }},
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions({ clerkId, searchQuery, filter, page = 1, pageSize = 20 }: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const skipAmount = (page - 1) * pageSize;
    
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : { };

      let sortOptions = {};

      switch (filter) {
        case "most_recent":
          sortOptions = { createdAt: -1 }
          break;
        case "oldest":
          sortOptions = { createdAt: 1 }
          break;
        case "most_voted":
          sortOptions = { upvotes: -1 }
          break;
        case "most_viewed":
          sortOptions = { views: -1 }
          break;
        case "most_answered":
          sortOptions = { answers: -1 }
          break;
        default:
          break;
      }

    const user = await User
    .findOne({ clerkId })
    .populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: 'tags', model: Tag, select: "_id name" },
        { path: 'author', model: User, select: '_id clerkId name picture'}
      ]
    })

    const isNext = user.saved.length > pageSize
    
    if(!user) {
      throw new Error('User not found');
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getUserInfo = async ({userId}: {userId: string}) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({clerkId: userId})
    
    if(!user) {
      throw new Error("User not found");
    };

    const totalQuestions = await Question.countDocuments({author: user._id})
    const totalAnswers = await Answer.countDocuments({author: user._id})

    return {
      user,
      totalQuestions,
      totalAnswers,
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

type UpdateUserProfileParams = {
  clerkId: string;
  name: string;
  username: string;
  location: string;
  bio: string;
  portfolioWebsite: string
  pathname: string
}
export const updateUserProfile = async ({clerkId, name, username, location, bio, portfolioWebsite, pathname}: UpdateUserProfileParams) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({clerkId});
    if(!user){
      throw new Error("User not found")
    }

    await User.findOneAndUpdate(
      {clerkId},
      {name, username, location, bio, portfolioWebsite},
      {new: true}
    )

    revalidatePath(pathname)
  } catch (error) {
    console.log(error);
    throw error;
  }
};