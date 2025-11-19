const bcrypt = require('bcryptjs');
const joi = require('joi');
const User = require('../Models/user_model');
const jwt = require('jsonwebtoken');


const add_user = async (req,res)=>{
    try {
      
        const authSchema = joi.object({
            name:joi.string().required(),
            email:joi.string().email().required(),
            password:joi.string()
                    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
                    .min(6)
                    .required(),
            role:joi.string().required()
                
        })

        const {error,value} = authSchema.validate(req.body,{ stripUnknown: true });
        if(error){
            return res.status(400).json({msg:error.details[0].message});
        }

        const {name,email,password,role} = value;
       
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exist"});
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        const new_user = new User({name,email,password:hashedPassword,role});
        
        await new_user.save();
        console.log('User saved successfully');
        return res.status(201).json({message:"User saved Successfully"});
   
    } catch (error) {
       return res.status(400).json({message:error.message});
    }
}

const login_user = async (req,res)=>{
    try {
        const loginSchema = joi.object({
            email:joi.string().email().required(),
            password:joi.string().required() 
        })

        const {error,value} = loginSchema.validate(req.body);
        if(error){
            return res.status(400).json({msg:error.details[0].message});
        }

        const {email,password} = value;
        
        const existingUser = await User.findOne({email});
        if(!existingUser){
           return res.status(400).json({msg:'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '3d' } 
        );

        return res.status(200).json({
                    message: "Login successful",
                     token,
                    user:{
                        name: existingUser.name,
                        email: existingUser.email,
                        role: existingUser.role,
                    }
                });



    } catch (error) {
       return res.status(500).json({msg:error});
    }
}

const delete_user = async (req,res)=>{
    try{
        
        await User.findByIdAndDelete(req.user.id);
        return res.status(201).json({message:"Account deleted Successfully"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

module.exports = {add_user,delete_user,login_user};