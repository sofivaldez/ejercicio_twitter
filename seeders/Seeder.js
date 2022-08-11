const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const { User, Tweet } = require("../models/");

faker.locale = "es";

module.exports = async () => {
  const users = [];
  const tweets = [];

  for (let i = 0; i < 20; i++) {
    const user = new User({
      firstname: faker.name.firstName,
      lastname: faker.name.lastName,
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: await bcrypt.hash("1234", 8),
      bio: faker.lorem.paragraphs(),
      avatar: "default.png",
    });
    users.push(user);
  }

  for (let i = 0; i < 40; i++) {
    const tweet = new Tweet({
      content: faker.lorem.paragraphs(),
      createdAt: faker.date.recent(20),
    });
    tweets.push(tweet);
  }

  for (let i = 0; i < users.length; i++) {
    users[i].tweets.push(tweets[i * 2]._id);
    users[i].tweets.push(tweets[i * 2 + 1]._id);
    tweets[i * 2].user = users[i]._id;
    tweets[i * 2 + 1].user = users[i]._id;
    users[i].following.push(users[(i + 1) % 20]._id);
    users[(i + 1) % 20].followers.push(users[i]._id);
  }

  for (const tweet of tweets) {
    const likes = Array.from(
      { length: Math.floor(Math.random() * 20) },
      () => users[Math.floor(Math.random() * 19)]._id,
    );

    tweet.likes = likes;
  }

  await User.insertMany(users);
  await Tweet.insertMany(tweets);
};
