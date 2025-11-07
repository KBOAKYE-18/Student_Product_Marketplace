const Order = require('../Models/order_model');
const joi = require('joi');

const place_order = async(req,res)=>{
    try {
        const item_schema = joi.object({
            product: joi.string()
                .length(24)
                .hex()
                .required()
                .messages({
                    "string.length": "Product ID must be 24 characters",
                    "string.hex": "Product ID must be a valid hexadecimal",
                    "any.required": "Product ID is required"
                }),
            quantity: joi.number()
                .min(1)
                .required()
                .messages({
                    "number.min": "Quantity must be at least 1",
                    "any.required": "Quantity is required"
                })
        });


        const order_schema = joi.object({
            items: joi.array()
                .items(item_schema)
                .min(1)
                .required()
                .messages({"array.min": "At least one item is required","any.required": "Items are required"}),
            totalPrice:joi.number().required(),
            status:joi.string()
                .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
                .default('pending')
                .required()
        })
        
        const {error,value} = order_schema.validate(req.body,{ stripUnknown: true });
        if(error){
            return res.status(400).json({msg:error.details[0].message});
        }
        
        const {items,totalPrice,status} = value;
       

        const new_order = new Order({
            user:req.user._id,
            items,
            totalPrice,
            status,
        })

        await new_order.save();
        return res.status(201).json({msg:'Item added to basket'});

    } catch (error) {
       return res.status(500).json({message:error.message});
    }
}

const review_orders = async (req,res)=>{
    try{
        const orders = await Order.find().populate('user','name email')
        .populate('items.product','name price')
        .sort({ createdAt: -1 });  

        return res.status(200).json({ orders });  
    }catch(error){
        return res.status(500).json({msg:error.message});
    }
}

const review_orders_id = async (req,res)=>{
    try{
        const id_schema = joi.object({
            id:joi.string().length(24).hex().required()
        })

        const {error,value} = id_schema.validate(req.params);
       
        if (error) {
            return res.status(400).json({ message:error.details[0].message });
        }

        const {id} = value;

        const order = await Order.findById(id)
        .populate('user', 'name email')          
        .populate('items.product', 'name price'); 

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return  res.status(200).json({ order });
        
    }catch(error){
        return res.status(500).json({msg:error.message})
    }
}


module.exports = {place_order,review_orders,review_orders_id};