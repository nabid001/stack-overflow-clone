import { Schema, model, models } from "mongoose";

const AnswerSchema = new Schema({
    content: { type: String, required: true},
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User", }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User", }],
    createdAt: { type: Date, default: Date.now}
})

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;