const Review = require('../Models/review_model');
const joi = require('joi');

const add_review = async(req,res)=>{
    try {
        const reviewSchema = joi.object({
            rating:joi.number().min(1).max(5),
            comment:joi.string()
        })

        const {error,value} = reviewSchema.validate(req.body);
        if(error){
            return res.status(400).json({msg:error.details[0].message});
        }

        const {rating,comment} = value;
        const product_id = req.params.product_id;
        
        const new_review = new Review({
            user:req.user.id,
            product:product_id,
            rating:rating,
            comment:comment
        })

        await new_review.save();
        return res.status(201).json({msg:'Review Saved successfully'});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

const view_reviews = async (req,res)=>{
    try{
        const reviews = await Review.find().populate('user','name email')
        .populate('product','name')
        .sort({ createdAt: -1 });  

        return res.status(200).json({ reviews });  
    }catch(error){
        return res.status(500).json({msg:error.message});
    }  
}


module.exports = {add_review,view_reviews};