"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"

type CreateUserProps = {
    clerkId: string,
    name: string,
    username: string,
    email: string,
    picture: string
}

type UpdateUserProps = {
    clerkId: string,
    userData: {
        name: string,
        username: string,
        email: string,
        picture: string
    },
    path: string
}

export const getUserById = async (clerkId: any) => {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId });

        return user
    } catch (error) {
        console.log(error);
        throw new Error(error as any)
    }
}

export const createUser = async (user: CreateUserProps) => {
    try {
        await connectToDatabase();

        const newUser = await User.create(user);

        return newUser
    } catch (error) {
        console.log(error);
        throw new Error(error as any)
    }
}

export const updateUser = async ({clerkId, userData, path}: UpdateUserProps) => {
    try {
        await connectToDatabase();

         await User.findOneAndUpdate({clerkId}, userData, {
            new: true
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw new Error(error as any)
    }
}

export const deleteUser = async ({clerkId}: any) => {
    try {
        await connectToDatabase();

         const user = await User.findOneAndDelete({clerkId});

         if(!user) {
            throw new Error("User not found")
         }

         // get user questions ids
        //  const getUserQuestionIds = await Question.find({author: user._id}).distinct("_id")

        await Question.deleteMany({ author: user._id });

        // TODO: delete user answers, comments, etc.
    
        const deletedUser = await User.findByIdAndDelete(user._id);
    
        return deletedUser;

    } catch (error) {
        console.log(error);
        throw new Error(error as any)
    }
}