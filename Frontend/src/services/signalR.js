import {
  HubConnectionBuilder,
  LogLevel
} from "@microsoft/signalr";

const HUB_URL =
  import.meta.env.VITE_SIGNALR_HUB_URL ||
  "http://localhost:8081/hubs/orders";

let connection = null;
let connectionPromise = null;

export function startOrderHub() {
  // If already connected, reuse the existing connection.
  if (connection?.state === "Connected") {
    return Promise.resolve(connection);
  }

  // If a connection is currently being started,
  // return the same promise instead of starting another one.
  if (connectionPromise) {
    return connectionPromise;
  }

  connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => {
        return localStorage.getItem("token") || "";
      }
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  connectionPromise = connection
    .start()
    .then(() => {
      console.log("SignalR connected.");
      return connection;
    })
    .catch((error) => {
      console.error("SignalR connection failed:", error);

      connection = null;
      connectionPromise = null;

      throw error;
    });

  return connectionPromise;
}