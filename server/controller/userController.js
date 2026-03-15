import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const email = req.body.email?.trim().toLowerCase();

        // check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing Required fields' })
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' })
        }

        // validate password strength
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        // check if user already exists
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }
        // create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name: name.trim(), email, password: hashedPassword
        })

        // return success Message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({ messaage: 'User created successfully', token, user: newUser })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        // check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        // check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        // return success Message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(201).json({ messaage: 'Login successfully', token, user })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {

        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        // return user
        user.password = undefined;

        return res.status(201).json({ user })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// Controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req,res)=>{
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}