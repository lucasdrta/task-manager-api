import { apiReference } from "@scalar/express-api-reference";
import { Router } from "express";
import { openApiDocument } from "../docs/openapi.js";

export const docsRoutes = Router();

docsRoutes.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

docsRoutes.use(
  "/",
  apiReference({
    theme: "purple",
    url: "/docs/openapi.json",
  }),
);
