import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String, required : true},
    category : {type : String, required : true},
    image : {type : Array, required : true},
    sizes : {type : Array, required : true},
    colors : {type : Array, required : true},
    discounted_price : {type : Number, required : true},
    price : {type : Number, required : true},
    date : {type : Number, required : true},
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel