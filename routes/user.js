const { Router } = require("express");
const { userModel } = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;;

const userRouter = Router();

// 🔐 Signup route
userRouter.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existing = await userModel.findOne({ email });

        if (existing) {
            return res.json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            email,
            password: hashedPassword
        });

        res.json({ message: "You are signed up" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Signup error" });
    }
});

// 🔐 Signin route
userRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ message: "Incorrect credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Signin error" });
    }
});

module.exports = { userRouter };
