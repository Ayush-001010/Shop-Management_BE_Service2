import { Sequelize } from "sequelize";

const sequelize = new Sequelize('customerDashboard', 'root', 'Ayush@10', {
    host: "localhost",
    dialect: "mysql",
    logging: false
})



export default sequelize;