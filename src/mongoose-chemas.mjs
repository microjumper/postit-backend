import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost:27017/postitdb", { useNewUrlParser: true, useUnifiedTopology: true });
const postSchema = {
    title: String,
    content: String
};
export const Post = mongoose.model("Post", postSchema);
const userSchema = {
    username: String,
    password: String
};
export const User = mongoose.model("User", userSchema);
