import { Router, Request, Response } from "express";
import aws from "aws-sdk";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { TPayload } from "../types/payload";

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

const get = router.get("/", (req: Request, res: Response) => {});

export const payload = { router, post, get };

// sqs.receiveMessage(
//   {
//     QueueUrl: process.env.QUEUE_URL || "",
//     MaxNumberOfMessages: 10,
//     WaitTimeSeconds: 5,
//   },
//   (err, data) => {
//     if (err) {
//       res.send({
//         success: false,
//         message: "Erro ao receber mensagem!",
//         error: err,
//       });
//     } else if (data.Messages && data.Messages.length > 0) {
//       data.Messages.forEach((message) => {
//         sqs.deleteMessage(
//           {
//             QueueUrl: process.env.QUEUE_URL || "",
//             ReceiptHandle: message.ReceiptHandle || "",
//           },
//           (delErr, delData) => {
//             if (delErr) {
//               res.send({
//                 success: false,
//                 message: "Erro ao deletar mensagem!",
//                 error: delErr,
//               });
//             } else {
//               res.send({
//                 success: true,
//                 message: "Sucesso ao receber e deletar mensagem!",
//                 data: data.Messages,
//               });
//             }
//           }
//         );
//       });
//     } else {
//       res.send({
//         message: "Não existem mensagens na fila SQS!",
//       });
//     }
//   }
// );
