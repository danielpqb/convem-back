import { Router, Request, Response } from "express";

const router = Router();

const post = router.post("/payload", (req: Request, res: Response) => {});

const get = router.get("/payload", (req: Request, res: Response) => {});

export { post, get };
