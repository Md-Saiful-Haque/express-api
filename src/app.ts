import express, { type Application, type Request, type Response } from "express"
import { logger } from "./middleware/logger";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoute } from "./api/routes/auth.route";

const app: Application = express();

app.use(logger)
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
   
   res.send("Hello! I'm Express");
})

app.use("/auth", authRoute)

app.use(globalErrorHandler)

export default app;