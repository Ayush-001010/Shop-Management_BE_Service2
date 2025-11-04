import express from "express";
import amqplib from "amqplib";
import model from "../Sequelize/Model";
import { Server } from 'socket.io';
import { createServer } from "http";
import sequelize from "../Sequelize/dbConfig";
import { Redis } from "ioredis";


const app = express();
const redisClient = new Redis();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


io.on("connection", async (socket) => {
    socket.on("register_notification_service", (userDetails) => {
        console.log("Hey! I am here !! " , userDetails.emailID);
        redisClient.set(`UserEmail_Notification:${userDetails.emailID}`, socket.id);
    });
});

const notificationWorker = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "Notification_Queue";

    await channel.assertQueue(queueName, { durable: false });
    channel.consume(queueName, async (message) => {
        if (message === null) return;
        const messageContent = message.content.toString();
        const data = JSON.parse(messageContent);
        console.log("Data   ", data);
        const { Message, By, Reciver, Type } = data;

        await model.Notification.create({
            Message,
            By,
            Reciver,
            Type
        });
        const socketID = await redisClient.get(`UserEmail_Notification:${Reciver}`);
        if (socketID) {
            io.to(socketID).emit("new-notification-recived", data);
        }
        channel.ack(message);
    })
}

console.log("Hello Everyone, I am working!!");
notificationWorker();

server.listen(3000, () => {
    sequelize.sync().then(() => {
        console.log(`Server running at http://localhost:${3000}`);
    });
});