module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const tweetSchema = new Schema(
    {
      content: { type: String, max: 140, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true },
  );

  const Tweet = mongoose.model("Tweet", tweetSchema);
  return Tweet;
};
