
import express from 'express';
import { addToCart, UpdateCart, getUserCart, removeFromCart } from '../controllers/cartController.js';
import AuthUser from '../middleware/Auth.js';

const CartRouter = express.Router();

CartRouter.post('/add', AuthUser, addToCart);
CartRouter.post('/update', AuthUser, UpdateCart);
CartRouter.post('/get', AuthUser, getUserCart);
CartRouter.post('/remove', AuthUser, removeFromCart);






export default CartRouter;