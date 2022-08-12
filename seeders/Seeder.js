const { faker } = require("@faker-js/faker");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { User, Tweet } = require("../models");

faker.locale = "es";

module.exports = async () => {
  const users = [];
  const tweets = [];

  for (let i = 0; i < 20; i++) {
    const user = new User({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: faker.internet.userName(), //estaría bueno que se correspondiera con el firstname, lastname
      email: faker.internet.email(),
      password: await bcrypt.hash("1234", 8), //idealmente en el modelo, un hook
      bio: faker.lorem.paragraphs(),
      avatar: "default.png",
    });
    users.push(user);
  }

  for (let i = 0; i < 40; i++) {
    const randomUser = users[faker.datatype.number(users.length - 1)];

    const tweet = new Tweet({
      content: faker.lorem.paragraphs(), //tratar de que sea max. 140 char
      user: randomUser._id,
      createdAt: faker.date.recent(20),
    });

    randomUser.tweets.push(tweet._id);

    tweets.push(tweet);
  }

  for (const user of users) {
    const remainingUsers = _.without(users, user);
    const someUsers = _.sampleSize(remainingUsers, faker.datatype.number(remainingUsers.length));
    for (const oneUser of someUsers) {
      user.following.push(oneUser._id);
      oneUser.followers.push(user._id);
    }
  }

  //   for (let i = 0; i < users.length; i++) {
  //     users[i].tweets = Array.from(
  //         { length: faker.datatype.number() },
  //         () => users[Math.floor(Math.random() * 19)]._id,
  //       )
  //   }

  //   for (let i = 0; i < users.length; i++) {
  //     users[i].tweets.push(tweets[i * 2]._id);
  //     users[i].tweets.push(tweets[i * 2 + 1]._id);
  //     tweets[i * 2].user = users[i]._id;
  //     tweets[i * 2 + 1].user = users[i]._id;
  //     users[i].following.push(users[(i + 1) % 20]._id);
  //     users[(i + 1) % 20].followers.push(users[i]._id);
  //   }

  for (const tweet of tweets) {
    const someUsers = _.sampleSize(users, faker.datatype.number(users.length));
    for (const oneUser of someUsers) {
      tweet.likes.push(oneUser._id);
    }
  }

  await User.insertMany(users);
  await Tweet.insertMany(tweets);
};
