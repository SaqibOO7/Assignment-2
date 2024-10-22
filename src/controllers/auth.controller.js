import bcrypt from 'bcryptjs'
import User from "../models/user.model.js"
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signupUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        console.log(password, confirmPassword, name, email,)

        if ([name, email, password, confirmPassword].some((field) => field?.trim() === "")) {

            return res.status(401).json({ error: "All fields are required" });
        }

        if(password?.length < 6){
            return res.status(401).json({ error: "Password must greater than length 5"})
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ error: "Password do not match" })
        }

        const user = await User.findOne({
            $or: [{email}, {name}]
        });

        if (user) {
            return res.status(401).json({ error: "User already exits. Try different name or email" })
        }

        //Hasing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //CREATING NEW USER
        const newUser = new User({
            name: name.toLowerCase(),
            email,
            password: hashedPassword            
        })

        if (newUser) {
            //GENERATE JWT TOKEN HERE
            
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                message: "User signed in successfully"
            })
        }
        else {
            res.status(401).json({ error: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await User.findOne({ name });

        if (!user) {
            return res.status(400).json({ error: "Invalid name" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid password" });
        }

        //generating token and set cookies
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            message: "User logged in successfully"
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal server error"})
    }

}

export const logoutUser = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"})

    } catch (error) {
        console.log("Error in loggeout controller", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}
