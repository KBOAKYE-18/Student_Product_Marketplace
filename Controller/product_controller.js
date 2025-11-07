const Product = require('../Models/product_model');
const joi = require('joi');

const add_product = async(req,res)=>{
    try {
        const product_schema = joi.object({
            name:joi.string().required(),
            description:joi.string().required(),
            price:joi.number().min(0).required(),
            category:joi.string().required(),
            stock:joi.number().min(1).required(),
            image:joi.string().uri().required()
        })

        const {error,value} = product_schema.validate(req.body,{ stripUnknown: true });
        if(error){
            return res.status(400).json({msg:error.details[0].message});
        }

        const {name,description,price,category,stock,image} = value;
        const new_product = new Product({
            name:name,
            description:description,
            price:price,
            category:category,
            stock:stock,
            image:image,
            seller:req.user.id
        })

        

        await new_product.save();
        return res.status(201).json({msg:'Product Saved successfully'});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

const update_product = async(req,res) =>{
    try{
        const product_schema = joi.object({
            price:joi.number().min(0),
            stock:joi.number().min(1),
            image:joi.string()
        })

        const {error,value} = product_schema.validate(req.body);
        if(error){
            return res.status(400).json({msg:error.details[0].message});
        }

        const {price,stock,image} = value;
       
        const schema = joi.object({
            id:joi.string().length(24).hex().required()
        })

        const {err,val} = schema.validate(req.params);
        if(err){
            return res.status(400).json({ msg:err.details[0].message});
        }

        const {id} = val;
        
        const updates = {};
        if (price !== undefined) updates.price = price;
        if (stock !== undefined) updates.stock = stock;
        if (image !== undefined) updates.image = image;

        const updateProduct = await Product.updateOne(
            { _id:id },
            {$set:updates}
        );

        if(updateProduct.matchedCount > 0){
            if(updateProduct.modifiedCount > 0){
                return res.status(200).json({msg:"Product updated successfully"});
            }else{
                return  res.status(200).json({msg:"Product update failed"});
            }
        }else{
            return res.status(404).json({msg:"Product was not found for update"});
        }

        
    }catch(error){
        return res.status(500).json({msg:error.message});
    }
}

const delete_product = async(req,res)=>{
    try{
        const schema = joi.object({
            product_id:joi.string().length(24).hex().required()
        })

        const {error,value} = schema.validate(req.params);
        if(error){
            return res.status(400).json({ msg:error.details[0].message });
        }

        const {product_id} = value;
        const product = await Product.findOne({
            _id:product_id,
            seller:req.user.id
        })

        if(!product){
            return res.status(403).json({msg:"You cannot delete this product"});
        }

        product.isDeleted = true;
        await product.save();

        return res.status(200).json({msg:"Product deleted successfully"});
        
    }catch(error){
        return res.status(500).json({msg:error.message});
    }
    
}

const list_products = async(req,res) =>{
    try{
        const all_products = await Product.find().populate('seller','name email');
        if(all_products.length > 0){
            return res.status(200).json({produtcs:all_products});
        }else{
            return res.status(200).json({products:[],msg:"No products available"});
        }
    }catch(error){
       return res.status(500).json({msg:error.message});
    }
}

const get_product_id = async(req,res)=>{
    try{
        const schema = joi.object({
            id:joi.string().length(24).hex().required()
        })

        const {error,value} = schema.validate(req.params);
        if(error){
            return res.status(400).json({ msg:error.details[0].message });
        }

        const {id} = value;

        const get_product = await Product.findById(id).populate('seller','name email');
        if(get_product){
            return res.status(200).json({product:get_product,msg:"Product found"})
        }else{
            return res.status(404).json({msg:"Product was not found"});
        }
    }catch(error){
       return res.status(500).json({msg:error.message})
    }
}

const get_product_by_category = async (req,res)=>{
    try{

        const schema = joi.object({
            category:joi.string().length(24).hex().required()
        })

        const {error,value} = schema.validate(req.params);
        if(error){
            return res.status(400).json({ msg:error.details[0].message });
        }

        const {category} = value;

        const products = await Product.find({category}).populate('seller','name email');

        if (products.length > 0) {
          return  res.status(200).json({ products });
        } else {
          return  res.status(200).json({ products: [], msg: "No products found in this category" });
        }
    }catch(error){
       return res.status(500).json({msg:error.message})
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