const Order = require('../Models/order_model');

const place_order = async(req,res)=>{
    try {
        const {items,totalPrice,status} = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item" });
        }

        const new_order = new Order({
            user:req.user._id,
            items,
            totalPrice,
            status,
        })

        await new_order.save();
        res.status(201).json({msg:'Item added to basket'});

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const review_orders = async (req,res)=>{
    try{
        const orders = await Order.find().populate('user','name email')
        .populate('items.product','name price')
        .sort({ createdAt: -1 });  

        res.status(200).json({ orders });  
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}

const review_orders_id = async (req,res)=>{
    try{
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findById(orderId)
        .populate('user', 'name email')          
        .populate('items.product', 'name price'); 

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
        
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}


module.exports = {place_order,review_orders,review_orders_id};