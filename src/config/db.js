import mongoose from "mongoose";
const connectDB = async () => {

try {
    const connInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
    if (connInstance) {
        console.log(`\\n MongoDB Connected: ${connInstance.connection.host}`);
    }
} catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);// Exit the process with Failure
}

}

export default connectDB;