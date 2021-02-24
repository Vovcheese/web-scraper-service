import { Socket, Server } from "socket.io"
import { createServer } from "http"
import app from "./server"
import config from "@config/index"

export const server = createServer(app.callback()).listen(
  config.server.port,
  async () => {
    console.log(`Server listen on port ${config.server.port}`)
  }
)

export const ioServer = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

ioServer.on("connection", (socket: Socket) => {
  console.log("Connection", socket.id)
})
