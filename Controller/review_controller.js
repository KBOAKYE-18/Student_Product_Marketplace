const Review = require('../Models/review_model');

const add_review = async(req,res)=>{
    try {
        const {rating,comment} = req.body;
        const product_id = req.params.id;
        const new_review = new Review({
            user:req.user._id,
            product:product_id,
            rating:rating,
            comment:comment
        })

        await new_review.save();
        res.status(201).json({msg:'Review Saved successfully'});

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const view_reviews = async (req,res)=>{
    try{
        const reviews = await Review.find().populate('user','name email')
        .populate('product','name')
        .sort({ createdAt: -1 });  

        res.status(200).json({ reviews });  
    }catch(error){
        res.status(500).json({msg:error.message});
    }  
}


module.exports = {add_review,view_reviews};