import SubUser from "../models/subUser.model.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, mobileNumber } = req.body;

        if ([name, email, mobileNumber].some((field) => field?.trim() === "")) {

            return res.status(401).json({ error: "All fields are required" });
        }

        if(mobileNumber.length != 10){
            return res.status(401).json({ error: "Invalid mobile number"})
        }

        const user = new SubUser({ name, email, mobileNumber });
        await user.save();
        res.status(201).json(user);

    } catch (error) {
        console.log("Error in createUser controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getUserDetail = async (req, res) => {
    try {

        const {userId: id} = req.params;
        if(!userId){
            return res.status(401).json({error: "Invalid userId"});
        }

        const user = await SubUser.findById(userId);
        if(!user){
            return res.status(401).json({error: "user not found"})
        }

        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in getUserDetail controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}