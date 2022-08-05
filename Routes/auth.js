const router = require('express').Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../Routes/validation')
    //validation





router.post('/register', async(req, res) => {
    //lets validate  the data before we add user

    const { error } = registerValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    // checking if the user is already in
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});
//login 
router.post('/login', async(req, res) => {
    //lets validate the date before we a user 
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')
        // create and assign a token

    const token = jwt.sign({ _id: user._id }, 'secretkey', (err, token) => {
        res.header('auth-token', token).send(token);
    });
})


module.exports = router;