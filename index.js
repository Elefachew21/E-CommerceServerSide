import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./app.js";
dotenv.config({
    path: "./.env"
}); // Load environment variables from .env file

const startServer = async () => { 


    try {
        await connectDB();
        app.on("error", (error) => {
            console.log("Server Error:", error);
        });

        app.listen(process.env.PORT || 9000, () => {
            console.log(`Server is running on port ${process.env.PORT || 9000}`);
        });

    } catch (error) {
        console.error("Error starting server:", error); 
    }
}
startServer();
console.log(process.env.CLOUDINARY_API_KEY);
