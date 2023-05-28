import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { randomUUID } from "crypto";

const start = async () => {
  try {
    await natsWrapper.connect(
      "ticketing",
      randomUUID(),
      "http://nats-srv:4222"
    );
    natsWrapper.client.on("close", () => {
      console.log("Nats Connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets");
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Starting on port 3000!!!");
  });
};

start();
