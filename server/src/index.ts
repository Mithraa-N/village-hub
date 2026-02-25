import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import villageRoutes from "./routes/village.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8080"],
    credentials: true
}));
app.use(morgan("combined"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1", villageRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong. Please contact support.",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


app.listen(PORT, () => {
    console.log(`[SERVER] Village Hub Secure Backend running on port ${PORT}`);
});
