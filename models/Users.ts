import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    whatsapp: {
      type: String,
      unique: true,
      sparse: true, // allows users without WhatsApp
    }

  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
