import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { router } from "./routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "100kb" }));

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);
