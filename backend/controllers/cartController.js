import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, colors, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                if (cartData[itemId][size][colors]) {
                    cartData[itemId][size][colors] += quantity;
                } else {
                    cartData[itemId][size][colors] = quantity;
                }
            } else {
                cartData[itemId][size] = { [colors]: quantity };
            }
        } else {
            cartData[itemId] = { [size]: { [colors]: quantity } };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, msg: "Item added to cart", cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const UpdateCart = async (req, res) => {

    try {
        
        const { userId, itemId, size, colors, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        cartData[itemId][size][colors] = quantity;

         await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, msg: "cart is updated", cartData });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}
const getUserCart = async (req, res) => {

    try {
        
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        res.json({ success: true, cartData });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

const removeFromCart = async (req, res) => {
  try {
    const { itemId, color, size } = req.body;
    const userId = req.body.userId;

    if (!itemId || !color || !size || !userId) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartPath = `cartData.${itemId}.${size}.${color}`;

    console.log("Attempting to remove path:", cartPath);

    const updateResult = await userModel.updateOne(
      { _id: userId },
      { $unset: { [cartPath]: "" } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ success: false, message: "Item not found in the cart" });
    }

    const updatedUserData = await userModel.findById(userId);
    const updatedCart = updatedUserData.cartData;

    const cleanUpEmptyKeys = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          cleanUpEmptyKeys(obj[key]);
          if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        }
      }
    };

    cleanUpEmptyKeys(updatedCart);

    await userModel.updateOne({ _id: userId }, { cartData: updatedCart });

    res.json({ success: true, message: "Item removed from cart", cartData: updatedCart });
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export { addToCart, UpdateCart, getUserCart, removeFromCart };

