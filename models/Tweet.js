module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const tweetSchema = new Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });

  const Tweet = mongoose.model("Tweet", tweetSchema);
  return Tweet;
};
