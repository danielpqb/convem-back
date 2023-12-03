export type TPayload = {
  idempotencyId: string;
  amount: number;
  type: "credit" | "debit";
};

export type TPayloadCreateRequest = Omit<TPayload, "idempotencyId">;
