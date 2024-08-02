import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

mongoose
  .connect("mongodb://127.0.0.1/express_tutorial")
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Error: ${err}`));
const app = createApp();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running in PORT ${PORT}`);
});

// client_secret : oPQ9AVqx56DF7s1m9RAoIq_nMN7MgJeC
// client_id : 1266672667382124620
// redirect: https://localhost:3000/api/auth/discord/redirect
