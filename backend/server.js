import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

import { rooms } from "./utils/rooms.js";

const developmentUrl = "http://localhost:3000";
const productionUrl = "https://lingpal.vercel.app";

const io = new Server({
  cors: {
    origin: [developmentUrl, productionUrl],
  },
});

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  socket.on("join-room", (roomId) => {
    console.log("socket.id", socket.id);
    console.log("join-room", roomId);
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

const PORT = Deno.env.get("PORT") || 5050;

await serve(io.handler(), {
  port: PORT,
});
