"use server"

import { ViewQuestionParams } from "@/types/shared.types"
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interactive.model";

export const viewQuestoins = async ({questionId, userId}:ViewQuestionParams) => {
    try {
        await connectToDatabase();

        // Update view of the question.
        await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 }});

        if(userId) {
          const existingInteraction = await Interaction.findOne({ 
            user: userId,
            action: "view",
            question: questionId,
          })
    
          if(existingInteraction) return console.log('User has already viewed.')
    
          // Create interaction
          await Interaction.create({
            user: userId,
            action: "view",
            question: questionId,
          })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
