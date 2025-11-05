const Product = require('../Models/product_model');

const add_product = async(req,res)=>{
    try {
        const {name,description,price,category,stock,image} = req.body;
        const new_product = new Product({
            name:name,
            description:description,
            price:price,
            category:category,
            stock:stock,
            image:image,
            seller:req.user._id
        })

        await new_product.save();
        res.status(201).json({msg:'Product Saved successfully'});

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const update_product = async(req,res) =>{
    try{
        const {price,stock,image} = req.body;
        const productID = req.params.id;

        const updates = {};
        if (price !== undefined) updates.price = price;
        if (stock !== undefined) updates.stock = stock;
        if (image !== undefined) updates.image = image;

        const updateProduct = await Product.updateOne(
            { _id: productID },
            {$set:updates}
        );

        if(updateProduct.matchedCount > 0){
            if(updateProduct.modifiedCount > 0){
                res.status(200).json({msg:"Product updated successfully"});
            }else{
                res.status(200).json({msg:"Product update failed"});
            }
        }else{
            res.status(404).json({msg:"Product was not found for update"});
        }

        
    }catch(error){
        res.status(500).json({msg:error.message});
    }
}

const delete_product = async(req,res)=>{
    try{
        const product_id = req.params.id;
        const deleteProduct = await Product.deleteOne(
            {_id:product_id}
        );

        if(deleteProduct.deletedCount > 0){
            res.status(200).json({msg:"Product deleted successfully"});
        }else{
            res.status(404).json({msg:"Product not found ,delete operation failed"});
        }
    }catch(error){
        res.status(500).json({msg:error.message});
    }
    
}

const list_products = async(req,res) =>{
    try{
        const all_products = await Product.find().populate('seller','name email');
        if(all_products.length > 0){
            res.status(200).json({produtcs:all_products});
        }else{
            res.status(200).json({products:[],msg:"No products available"});
        }
    }catch(error){
        res.status(500).json({msg:error.message});
    }
}

const get_product_id = async(req,res)=>{
    try{
        const product_id = req.params.id;
        const get_product = await Product.findById(product_id).populate('seller','name email');
        if(get_product){
            res.status(200).json({product:get_product,msg:"Product found"})
        }else{
            res.status(404).json({msg:"Product was not found"});
        }
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}

const get_product_by_category = async (req,res)=>{
    try{
        const {category} = req.params;

        if (!category) {
            return res.status(400).json({ msg: "Category is required" });
        }

        const products = await Product.find({category}).populate('seller','name email');

        if (products.length > 0) {
            res.status(200).json({ products });
        } else {
            res.status(200).json({ products: [], msg: "No products found in this category" });
        }
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}


module.exports = {
    add_product,
    update_product,
    delete_product,
    list_products,
    get_product_id,
    get_product_by_category
};