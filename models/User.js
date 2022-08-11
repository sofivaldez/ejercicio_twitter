module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    bio: String,
    avatar: String,
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });

  const User = mongoose.model("User", userSchema);
  return User;
};
