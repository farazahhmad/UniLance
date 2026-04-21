// 1. Load env variables FIRST
require("dotenv").config();

// 2. Import app
const app = require("./src/app");

// 3. Import DB connection
const connectDB = require("./src/config/db");

// 4. Define PORT
const PORT = process.env.PORT || 5000;

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  // Join a private room based on the "Job ID" or "Chat ID"
  socket.on('join_room', (data) => {
    console.log(`join_room event from ${socket.id} for room:`, data);
    socket.join(data);
    console.log(`User joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    console.log('send_message event received:', data);
    if (!data?.room) {
      console.warn('send_message received without room:', data);
      return;
    }
    // Send to everyone else in the room, sender will handle local display
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// 5. Connect DB and Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// 6. Start server
startServer();

// 7. Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// 8. Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});