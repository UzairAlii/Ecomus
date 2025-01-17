import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import CartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import ContactEmailRouter from "./routes/contactEmailRoute.js";


const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors({ origin: "*" }))

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", CartRouter)
app.use("/api/order", orderRouter)
app.use("/api/send", ContactEmailRouter);

app.get("/", (req, res)=> {
    res.send("API WORKING")
})

app.listen(port, ()=> console.log("server started on port : " + port))