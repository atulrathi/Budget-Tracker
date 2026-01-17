const user = require ("../Models/User");

exports.updateIncome = async (req, res) => {
    try{
        const userId = req.userId;
        const { income } = req.body;

        if(!userId || !income){
            return res.status(400).json({ message: "User ID and income are required."});
        };

        const userdata = await user.findOneAndUpdate(
            { _id: userId },
            { Income: income },
            { new: true }
        );
        if(!userdata){
            return res.status(404).json({ message: "User not found."});
        };
        return res.status(200).json({ message: "Income updated successfully.", user: userdata.Income});

    }catch (err){ 
        console.error("Error updating income:", err);
        return res.status(500).json({ message: "Internal server error."});
    }
};

exports.updateBudget = async (req, res) => {
    try{
        const userId = req.userId;
        const { budget } = req.body;

        if(!userId || !budget){
            return res.status(400).json({ message: "User ID and budget are required."});
        };
        const userdata = await user.findOneAndUpdate(
            { _id: userId },
            { MonthlyBudget: budget },
            { new: true }
        );
        if(!userdata){
            return res.status(404).json({ message: "User not found."});
        };
        return res.status(200).json({ message: "Budget updated successfully.", user: userdata.Budget});
    }catch (err){ 
        console.error("Error updating budget:", err);
        return res.status(500).json({ message: "Internal server error."});
    }
}