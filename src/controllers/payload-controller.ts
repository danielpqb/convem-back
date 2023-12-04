import { Router, Request, Response } from "express";
import aws from "aws-sdk";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { TPayload } from "../types/payload";
import { payloadDB } from "../database/payload-db";

dotenv.config();

const sqs = new aws.SQS({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

const router = Router();

const post = router.post("/", (req: Request, res: Response) => {
  const params: TPayload = {
    idempotencyId: uuid(),
    amount: req.body?.amount || 100 + Math.floor(Math.random() * 100),
    type:
      req.body?.type || Math.floor(Math.random() * 2) === 0
        ? "credit"
        : "debit",
  };

  console.log("@params", params);

  sqs.sendMessage(
    {
      MessageBody: JSON.stringify(params),
      QueueUrl: process.env.QUEUE_URL || "",
    },
    (err, data) => {
      if (err) {
        res.send({
          success: false,
          message: "Erro ao criar mensagem!",
          error: err,
        });
      } else {
        res.send({
          success: true,
          message: "Sucesso ao criar mensagem!",
          data,
          body: params,
        });
      }
    }
  );
});

const get = router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await payloadDB.search();

    if (data) {
      return res.send({
        success: true,
        message: "Sucesso!",
        data,
      });
    } else {
      throw { message: "Nenhum dado encontrado." };
    }
  } catch (err) {
    res.send({
      success: false,
      message: "Erro!",
      error: err,
    });
  }
});

export const payload = { router, post, get };
