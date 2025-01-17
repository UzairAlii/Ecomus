import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [APIproducts, setAPIProducts] = useState([]);
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || {});
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const navigate = useNavigate();

    const addToCart = async (itemId, selectedColor, selectedSize, quantity, currentImageIndex) => {
        let cartData = structuredClone(cartItems);

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (!cartData[itemId][selectedColor]) {
            cartData[itemId][selectedColor] = {};
        }

        if (!cartData[itemId][selectedColor][selectedSize]) {
            cartData[itemId][selectedColor][selectedSize] = {};
        }

        if (!cartData[itemId][selectedColor][selectedSize][currentImageIndex]) {
            cartData[itemId][selectedColor][selectedSize][currentImageIndex] = 0;
        }

        cartData[itemId][selectedColor][selectedSize][currentImageIndex] += quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/add`, {
                    userId: token, 
                    itemId,
                    size: selectedSize,
                    colors: selectedColor,
                    quantity,
                    imageIndex: currentImageIndex
                }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const color in cartItems[itemId]) {
                for (const size in cartItems[itemId][color]) {
                    for (const imageIndex in cartItems[itemId][color][size]) {
                        try {
                            totalCount += cartItems[itemId][color][size][imageIndex];
                        } catch (error) {
                            console.error("Error calculating cart count:", error);
                        }
                    }
                }
            }
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            for (const color in cartItems[itemId]) {
                for (const size in cartItems[itemId][color]) {
                    for (const imageIndex in cartItems[itemId][color][size]) {
                        const quantity = cartItems[itemId][color][size][imageIndex];
                        const product = APIproducts.find((product) => product._id === itemId);
                        if (product && product.discounted_price) {
                            totalAmount += product.discounted_price * quantity;
                        }
                    }
                }
            }
        }
        return totalAmount;
    };

    const currency = '$';
    const delivery_fee = 10;

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        
    }, [cartItems]);

    const getProductData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setAPIProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again later.");
        }
    };


    useEffect(() => {
        getProductData();
    }, []);

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    useEffect(() => {
        localStorage.setItem('email', email);
    }, [email]);

    const value = { currency, delivery_fee, cartItems, addToCart, getCartCount, getCartAmount, setCartItems, navigate, backendUrl, APIproducts, setAPIProducts, setToken, token, email, setEmail };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;