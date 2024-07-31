import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  //call serializer once ex. login
  console.log(`Inside serialize user`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  //any request after serializing, will call this instead
  console.log(`Inside deserializer`);
  console.log(`Deserializing user id ${id}`);

  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new Strategy(
    // { usernameField: "email" },
    async (username, password, done) => {
      console.log(`username: ${username}`);
      console.log(`password: ${password}`);
      try {
        const findUser = await User.findOne({ username });
        if (!findUser) throw new Error("User not found");
        if (!comparePassword(password, findUser.password))
          throw new Error("Invalid credentials");
        done(null, findUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
