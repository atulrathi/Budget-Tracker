const User = require("../Models/User");

exports.usercontroller = async (req, res) => {
    try{
        const userid = req.userId; 

        if(!userid){
            return res.status(400).json({message:"User ID not found"});
        };

        const user = await User.findById(userid).select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"});
        };

        return res.status(200).json({user});
    }catch(error){
        console.error("Error fetching user data:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
};