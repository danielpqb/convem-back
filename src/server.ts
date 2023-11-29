import express from "express";
import aws from "aws-sdk";

const app = express();
const folder = process.env.PWD;

app.use(express.static(folder || ""));
app.use(express.json());

const sqs = new aws.SQS();

aws.config.update({ region: "sa-east-1" });
