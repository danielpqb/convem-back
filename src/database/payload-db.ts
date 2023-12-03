import Dynamo from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import { TPayload, TPayloadCreateRequest } from "../types/payload";

const tableName = "payloads";
const db = new Dynamo.DocumentClient({
  region: "sa-east-1",
});

async function create(body: TPayloadCreateRequest) {
  const params = { TableName: tableName, Item: body };

  const res: TPayload = { ...body, idempotencyId: uuid() };

  try {
    db.put(params);
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const payloadDB = { create };
