import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

const currency = 'USD'
const deliveryCharges = 10
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Order by COD 

const placeOrderCOD = async (req, res) => {

    try {

        const { userId, items, amount, address } = req.body;

        const orderdata = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: "false",
            date: Date.now()
        }

        const newOrder = new orderModel(orderdata);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully" });



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}


// Order by Stripe

const placeOrderStripe= async (req, res) => {

    try {
        
        
        const { userId, items, amount, address } = req.body;
        const  { origin }  = req.headers;

        const orderdata = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: "false",
            date: Date.now()
        }

        const newOrder = new orderModel(orderdata);
        await newOrder.save();

        const line_items = items.map((item) => (
            {
                price_data : {
                    currency: currency,
                    product_data : {
                        name : item.name
                    },
                    unit_amount : item.price * 100
            },
            quantity : item.quantity
        }
        ))

        line_items.push({
            price_data : {
                currency: currency,
                product_data : {
                    name : 'Delivery charges'
                },
                unit_amount : deliveryCharges * 100
        },
        quantity : 1

        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
          });
          
          res.json({
            success: true,
            session_url: session.url,
          });
          

    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }

}

const verifyStripe = async (req, res) => {
    const { userId, orderId, success} = req.body;

    try {
        
        if(success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            await userModel.findByIdAndUpdate(userId, {cardData : {}})
            res.json({success:true})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }


    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}


// All orders data for admin panel

const AllOrders = async (req, res) => {

    try {

        const orders = await orderModel.find({});

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}

// All orders for frontend user

const userOrders = async (req, res) => {

    try {

        const { userId } = req.body;

        const orders = await orderModel.find({ userId });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }

}

// Update Order Status
const orderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required" });
        }

        const validStatuses = ["Order Placed", "Packing", "Out for Delivery", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { placeOrderCOD, verifyStripe, placeOrderStripe, AllOrders, userOrders, orderStatus }

