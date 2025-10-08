import dotenv from "dotenv";
import Server from "./server";

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);

const server = new Server(PORT);
server.start();
