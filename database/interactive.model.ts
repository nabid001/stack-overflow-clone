import { Document, Schema, model, models } from "mongoose";

export interface IInteractive extends Document {
    user: Schema.Types.ObjectId;
    action: string;
    question: Schema.Types.ObjectId;
    answer: Schema.Types.ObjectId;
    tags: Schema.Types.ObjectId[];
    createdAt: Date;
}

const InteractiveSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true  },
    action: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", },
    answer: { type: Schema.Types.ObjectId, ref: "Answer",  },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", }],
    createdAt: { type: Date, default: Date.now },
})

const Interaction = models.Interaction || model("Interaction", InteractiveSchema);

export default Interaction;