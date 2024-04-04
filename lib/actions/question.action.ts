"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

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
