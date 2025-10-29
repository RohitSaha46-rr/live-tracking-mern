// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import riderRoutes from "./routes/riderRoutes.js";
import { Rider } from "./models/Rider.js";
import { getRandomLocation } from "./utils/simulateLocation.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/riders", riderRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Send updates every 5 seconds
  setInterval(async () => {
    const riders = await Rider.find();
    for (let rider of riders) {
      const { latitude, longitude } = getRandomLocation(rider.latitude, rider.longitude);
      rider.latitude = latitude;
      rider.longitude = longitude;
      rider.updatedAt = Date.now();
      await rider.save();

      io.emit("locationUpdate", rider);
    }
  }, 5000);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));