import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema(
    {
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        address: {
            type: String,
            default: ""
        },

        isBanned: {
            type: Boolean,
            default: false
        },

        likedPets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pet"
            }
        ],

        adoptionRequests: [adoptionRequestSchema]
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);
