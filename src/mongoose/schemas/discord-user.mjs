import mongoose, { Schema } from "mongoose";

const DiscordUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);
