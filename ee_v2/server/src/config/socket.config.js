import { Server } from "socket.io";
import { ApiError } from "../utils/index.js";
import jwt from "jsonwebtoken";

/**
 * Socket.io configuration
 * @param {Object} server - HTTP server instance
 * @returns {Object} - Configured socket.io instance
 */
const configureSocket = async (server) => {
  try {
    // Create Socket.io server with CORS configuration
    const io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(",") || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      maxHttpBufferSize: 1e6, // 1MB
    });

    // Handle authentication middleware
    io.use(async (socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers.authorization?.split(" ")[1];

        if (!token) {
          return next(new ApiError(401, "Unauthorized: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
        };

        next();
      } catch (error) {
        return next(new ApiError(401, "Unauthorized: Invalid token"));
      }
    });

    // Setup event handlers
    setupSocketEvents(io);

    return io;
  } catch (error) {
    console.error("Socket.io configuration error:", error);
    throw new ApiError(500, "Failed to configure socket.io server");
  }
};

/**
 * Setup socket event handlers
 * @param {Object} io - Socket.io server instance
 */
const setupSocketEvents = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`User connected: ${socket.user.username} (${userId})`);

    onlineUsers.set(userId, socket.id);
    io.emit("users:online", Array.from(onlineUsers.keys()));
    socket.join(userId);

    socket.on("message:send", (data) => {
      const { recipientId, message, chatId } = data;
      const senderInfo = {
        id: socket.user.id,
        username: socket.user.username,
      };

      if (onlineUsers.has(recipientId)) {
        io.to(recipientId).emit("message:received", {
          sender: senderInfo,
          message,
          chatId,
          createdAt: new Date(),
        });
      }

      socket.emit("message:delivered", {
        messageId: data.messageId || Date.now().toString(),
        chatId,
        recipientId,
      });
    });

    socket.on("typing:start", (data) => {
      const { chatId, recipientId } = data;
      if (onlineUsers.has(recipientId)) {
        io.to(recipientId).emit("typing:updated", {
          chatId,
          userId: socket.user.id,
          typing: true,
        });
      }
    });

    socket.on("typing:stop", (data) => {
      const { chatId, recipientId } = data;
      if (onlineUsers.has(recipientId)) {
        io.to(recipientId).emit("typing:updated", {
          chatId,
          userId: socket.user.id,
          typing: false,
        });
      }
    });

    socket.on("message:read", (data) => {
      const { chatId, messageIds, recipientId } = data;
      if (onlineUsers.has(recipientId)) {
        io.to(recipientId).emit("message:status", {
          chatId,
          messageIds,
          status: "read",
          readAt: new Date(),
        });
      }
    });

    socket.on("room:join", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.user.username} joined room: ${roomId}`);
    });

    socket.on("room:leave", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.user.username} left room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username} (${userId})`);
      onlineUsers.delete(userId);
      io.emit("users:online", Array.from(onlineUsers.keys()));
    });
  });
};

export { configureSocket };