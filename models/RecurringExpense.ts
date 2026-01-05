import mongoose, { Schema, models } from "mongoose";

const RecurringExpenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["subscription", "emi"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    // endDate: {
    //   type: Date, // null for subscriptions
    // },

    interval: {
      type: String,
      enum: ["monthly", "weekly"],
      default: "monthly",
    },
  },
  { timestamps: true }
);

export const RecurringExpense =
  models.RecurringExpense ||
  mongoose.model("RecurringExpense", RecurringExpenseSchema);
