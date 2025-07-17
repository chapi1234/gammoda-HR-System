const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB Connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected");
        });

        const conn = await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;