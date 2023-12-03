import aws from "aws-sdk";
import { TPayload } from "../types/payload";
import dotenv from "dotenv";

dotenv.config();

const tableName = "payloads";
const db = new aws.DynamoDB.DocumentClient({
  region: "sa-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

async function search(terms?: Partial<TPayload>) {
  const params = { TableName: tableName, Key: terms || {} };

  try {
    const data = terms
      ? await db.get(params).promise()
      : await db.scan({ TableName: tableName }).promise();
    return data;
  } catch (err) {
    return err;
  }
}

export const payloadDB = { search };
