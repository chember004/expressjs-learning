import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cart from "./routes/cart.mjs";
import auth from "./routes/auth.mjs";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();

mongoose
  .connect("mongodb://127.0.0.1/express_tutorial")
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("hellocookie"));
app.use(
  session({
    secret: "secret",
    //set saveUninitialized to TRUE, if you want to persist the a session.
    //ex. user not login yet but added some items in the cart.
    //Then requires the user login/register to perform a checkout.
    saveUninitialized: false,
    // set resave to TRUE, if you want to change/update the session expiration
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running in PORT ${PORT}`);
});

app.get("/", (request, response) => {
  // console.log(request.session);
  console.log("home session id ", request.session.id);
  request.session.visited = true;
  response.cookie("cookie", "cookie monster", { maxAge: 30000, signed: true });
  response.status(200).send("Hello World!");
});

//sample session
//app.use(auth);
app.use(cart);

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  return res.sendStatus(200);
});

app.get("/api/auth/status", (req, res) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(req.user);
  console.log(req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logOut((err) => {
    if (err) return res.sendStatus(400);
    res.send(200);
  });
});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    console.log(req.user);
    res.sendStatus(200);
  }
);

// client_secret : oPQ9AVqx56DF7s1m9RAoIq_nMN7MgJeC
// client_id : 1266672667382124620
// redirect: https://localhost:3000/api/auth/discord/redirect
