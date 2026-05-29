import mongoose from "mongoose";
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected ✅");
        //console.log("DB NAME:", mongoose.connection.name);
        //console.log("DB STATE:", mongoose.connection.readyState);
    }catch(error){
       console.log("MongoDB connection failed ❌");
       console.error(error);
       process.exit(1);
    }
};
export default connectDB;