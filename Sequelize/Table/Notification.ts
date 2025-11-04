import { DataTypes } from "sequelize";
import sequelize from "../dbConfig";

const Notification = sequelize.define("NotificationTable", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Message: DataTypes.STRING,
    By: DataTypes.STRING,
    Reciver: DataTypes.STRING,
    Type: DataTypes.ENUM("Chat")
});

export default Notification;