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
     
}

const delete_product = async(req,res)=>{

}

const list_products = async(req,res) =>{

}

const get_product_id = async(req,res)=>{

}


module.exports = {
    add_product,
    update_product,
    delete_product,
    list_products,
    get_product_id
};