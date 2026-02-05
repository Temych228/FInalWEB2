import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["dog", "cat", "rodent", "bird", "fish"],
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },

    age: {
      type: Number,
      min: 0,
      required: true
    },

    description: {
      type: String,
      maxlength: 1000
    },

    location: {
      type: String,
      required: true
    },

    photoUrl: {
      type: String,
      default: ""
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Pet", petSchema);
