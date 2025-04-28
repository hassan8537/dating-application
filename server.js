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
const node_env = process.env.NODE_ENV || "development";
const secret_key = process.env.SECRET_KEY;
const max_age = Number(process.env.MAX_AGE) || 2592000000;
const base_url = process.env.BASE_URL;

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server =
  node_env === "production"
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
    secret: secret_key,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: max_age }
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
    origin:
      node_env === "production" ? process.env.ALLOWED_ORIGINS.split(",") : "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: node_env === "production",
    transports: ["websocket", "polling"],
    allowEIO3: true
  }
});

io.on("connection", async (socket) => {
  handlers.logger.success({ message: `New socket connected: ${socket.id}` });

  const chat_controller = require("./src/controllers/users/chat-controller");

  socket.on("new-chat", async ({ sender_id, receiver_id, text }) => {
    try {
      const new_chat = await chat_controller.newChat({
        sender_id,
        receiver_id,
        text
      });

      return socket.emit("response", new_chat);
    } catch (error) {
      handlers.logger.error({ message: error });
      return socket.emit(
        "error",
        handlers.event.error({
          object_type: "error",
          message: "Failed to send message"
        })
      );
    }
  });

  socket.on("get-chats", async ({ sender_id, receiver_id }) => {
    try {
      const chats = await chat_controller.getChats({ sender_id, receiver_id });

      handlers.logger.success({ message: "Messages", data: chats });
      return socket.emit(
        "response",
        handlers.event.success({
          object_type: "chats",
          message: "Messages",
          data: chats
        })
      );
    } catch (error) {
      handlers.logger.error({ message: error });
      return socket.emit(
        "error",
        handlers.event.error({
          object_type: "error",
          message: "Couldn't refresh messages"
        })
      );
    }
  });
});

server.listen(port, () => {
  connectToDatabase();
  handlers.logger.success({
    message: `Courageous Connection is live at ${base_url}`
  });
});
