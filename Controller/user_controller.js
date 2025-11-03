const bcrypt = require('bcryptjs');
const User = require('../Models/user_model');
const jwt = require('jsonwebtoken');


const add_user = async (req,res)=>{
    try {
        const {name,email,password,role} = req.body;
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exist"});
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        const new_user = new User({name,email,password:hashedPassword,role});
        
        await new_user.save();
        console.log('User saved successfully');
        res.status(201).json({message:"User saved Successfully"});
   
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}

const login_user = async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        const existingUser = await User.findOne({email});
        if(!existingUser){
            res.status(400).json({msg:'User does not exist'});
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

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
            }
        });



    } catch (error) {
        res.send(500).json({msg:error});
    }
}

const delete_user = async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.user._id);
        res.status(201).json({message:"Account deleted Successfully"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports = {add_user,delete_user,login_user};