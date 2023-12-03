import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { payload } from "./controllers/payload-controller";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/payloads", payload.router);

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
