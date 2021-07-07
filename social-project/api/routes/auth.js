const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
//REGISTER
router.post("/register", async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = await new User({ ...req.body, password: hashedPassword });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})
//LOGIN
router.post("/login", async (req, res) => {
    try {
        console.log(req.body.email);
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json({message:"user not found"});

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json({message:"wrong password"});

        res.status(200).json({data:user,message:"Login success"});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

module.exports = router;