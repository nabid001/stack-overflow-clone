"use server"

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "@/types/shared.types";
import User from "@/database/user.model";

export const getAllTags = async () => {
    try {
        await connectToDatabase();
        
        const tags = await Tag.find()

        return tags
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const interactedTag = async ({clerkId}: GetTopInteractedTagsParams) => {
    try {
        await connectToDatabase();

        const user = await User.find({clerkId});
        if(!user) throw new Error("User not found")
        
        const tags = await Tag.find().limit(3)

        return tags
    } catch (error) {
        console.log(error);
        throw error;
    }
}