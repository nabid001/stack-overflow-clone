"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserProps } from "@/types";
import { DeleteUserParams, UpdateUserParams } from "@/types/shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export const getUserById = async (clerkId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const createUser = async (user: CreateUserProps) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDatabase();
    const {clerkId, updateData, path} = params

    if(!clerkId) throw new Error("User not found");

    const updatedUser = await User.findOneAndUpdate({clerkId}, updateData, {
      new: true
    })

    revalidatePath(path)
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDatabase();
    const {clerkId} = params

    if(!clerkId) throw new Error("clerkId not found");

    const user = await User.findOneAndDelete({clerkId});

    if(!user) throw new Error("User not found")

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({author: user._id}).distinct("_id");

    await Question.deleteMany({author: user._id});

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser
  } catch (error) {
    console.log(error);
    throw error
  }
};
