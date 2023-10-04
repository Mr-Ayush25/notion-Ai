import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
    },
    userId: {
      type: String,
      require: true,
    },
    editorState: {
      type: String,
    },
  }
  // { timestamps: true }
);

export const Note =
  mongoose.models.notes || mongoose.model("notes", noteSchema);
