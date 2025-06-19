require("dotenv").config();
const express=require("express");
const app=express();
const cors = require('cors');
app.use(cors());
const mongoose=require("mongoose");
const { userRouter } = require("./routes/user");
const { todoRouter } = require("./routes/todo");
app.use(express.json());
app.use("/users",userRouter);
app.use("/todos",todoRouter);
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(4000);
    console.log("listening")
}
main();
