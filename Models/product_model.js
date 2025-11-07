const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const product_schema = new Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:String,required:true},
    stock:{type:Number},
    image:{type:String},
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true});


const Product = mongoose.model('Product',product_schema);
module.exports = Product;
