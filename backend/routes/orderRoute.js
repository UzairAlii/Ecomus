import express from "express";

import { placeOrderCOD, placeOrderStripe, verifyStripe, AllOrders, userOrders, orderStatus } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import Authuser from "../middleware/Auth.js";

const orderRouter = express.Router();

//ADMIN FEATURES

orderRouter.post("/list", adminAuth, AllOrders);
orderRouter.post("/status", adminAuth, orderStatus);

//PAYMENT ROUTES

orderRouter.post("/COD", Authuser, placeOrderCOD);
orderRouter.post("/stripe", Authuser, placeOrderStripe);
orderRouter.post("/verifyStripe", Authuser, verifyStripe);

//USER FEATURES

orderRouter.post("/userorders", Authuser, userOrders);

export default orderRouter;

