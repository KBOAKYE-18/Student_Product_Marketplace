const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const order_schema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items:[
        {
            product:{type:mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity:{type:Number,min:1}
        }
    ],
    totalPrice:{type:Number,required:true},
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    }
},{timestamps:true});


const Order = mongoose.model('Order',order_schema);
module.exports = Order;
