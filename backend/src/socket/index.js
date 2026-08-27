import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";

const app = express();

//Tạo 1 server http dựa trên app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map(); // {userId: socketId}

//Lắng nghe event kết nối
io.on("connection", async (socket) => {
  const user = socket.user;

  // console.log(`${user.displayName} online với socket ${socket.id}`);

  onlineUsers.set(user._id, socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  socket.join(user._id.toString());

  //Khi user connect thì add vào room (convo)
  const conversationIds = await getUserConversationsForSocketIO(user._id);
  //join đúng room
  conversationIds.forEach((id) => socket.join(id));

  //Khi frontend tạo room thì socket join vào
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });

  //tạo room theo userId
  socket.join(user._id.toString());

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    /* console.log(`socket disconnected: ${socket.id}`); */
  });
});

export { io, app, server };
