require("dotenv").config();
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const { handlers } = require("./src/utilities/handlers/handlers");
const connectToDatabase = require("./src/config/mongodb");
const path = require("path");
const adminSeeder = require("./src/middlewares/admin-seeder-middleware");

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || "development";
const secretKey = process.env.SECRET_KEY;
const maxAge = Number(process.env.MAX_AGE) || 2592000000;
const baseUrl = process.env.BASE_URL;

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server =
  nodeEnv === "production"
    ? (() => {
        try {
          const options = {
            key: fs.readFileSync(
              "/etc/letsencrypt/live/client1.appsstaging.com/privkey.pem"
            ),
            cert: fs.readFileSync(
              "/etc/letsencrypt/live/client1.appsstaging.com/cert.pem"
            ),
            ca: fs.readFileSync(
              "/etc/letsencrypt/live/client1.appsstaging.com/chain.pem"
            )
          };
          return require("https").createServer(options, app);
        } catch (error) {
          console.error(
            "SSL certificate files are missing or incorrect:",
            error
          );
          process.exit(1);
        }
      })()
    : require("http").createServer(app);

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: maxAge }
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("tiny"));
app.use(adminSeeder);

const adminRoutes = require("./src/routes/admin/index");
const userRoutes = require("./src/routes/users/index");
app.use(adminRoutes);
app.use(userRoutes);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: nodeEnv === "production",
    transports: ["websocket", "polling"],
    allowEIO3: true
  }
});

io.on("connection", async (socket) => {
  handlers.logger.success({ message: `New socket connected: ${socket.id}` });

  const chatController = require("./src/controllers/users/chat-controller");

  socket.on("new-chat", async ({ senderId, receiverId, text }) => {
    try {
      const newChat = await chatController.newChat({
        senderId,
        receiverId,
        text
      });

      return socket.emit("response", newChat);
    } catch (error) {
      handlers.logger.error({ message: error });
      return socket.emit(
        "error",
        handlers.event.error({
          objectType: "error",
          message: "Failed to send message"
        })
      );
    }
  });

  socket.on("get-chats", async ({ senderId, receiverId }) => {
    try {
      const chats = await chatController.getChats({ senderId, receiverId });

      handlers.logger.success({ message: "Messages", data: chats });
      return socket.emit(
        "response",
        handlers.event.success({
          objectType: "chats",
          message: "Messages",
          data: chats
        })
      );
    } catch (error) {
      handlers.logger.error({ message: error });
      return socket.emit(
        "error",
        handlers.event.error({
          objectType: "error",
          message: "Couldn't refresh messages"
        })
      );
    }
  });
});

server.listen(port, () => {
  connectToDatabase();
  handlers.logger.success({
    message: `Courageous Connection is live at ${baseUrl}`
  });
});
