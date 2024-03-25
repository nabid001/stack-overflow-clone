"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"

type Props = {
    clerkId: string,
    name: string,
    username: string,
    email: string,
    picture: string
}
export const createUser = async (user: Props) => {
    try {
        await connectToDatabase();

        const newUser = await User.create(user);

        return JSON.parse(JSON.stringify(newUser))
    } catch (error) {
        console.log(error);
        throw new Error(error as any)
    }
}