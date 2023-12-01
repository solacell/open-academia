let express = require('express');
let router = express.Router();
let Post = require('../models/Post');
let User = require('../models/User');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json( {message: 'Unauthorized' } );
    }

    try {
        
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        
        res.status(401).json( { message: 'Unauthorized'} );

    }
}


router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin Page"
        };

        res.render('admin/index', {locals, layout: adminLayout});
    } catch (error) {
        
    }
})

router.get('/register', async (req, res) => {
    try {
        const locals = {
            title: "Register - NodeJS Blog"
        };

        res.render('admin/register', {locals, layout: adminLayout});
    } catch (error) {
        
    }
})

router.get('/dashboard',authMiddleware ,async (req, res) => {
    res.render('admin/dashboard');
})

router.post('/admin', async (req, res) => {
    try {
        
        const {username, password} = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials'});
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);

        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
})

router.post('/register', async (req, res) => {

    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 5);
        
        try {
            
            const user = await User.create( { username, password: hashedPassword } );
            res.status(201).json({ message: 'User Created', user});

        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: "User already exits."});
            } 
            res.status(500).json({ message: 'Internal server error.'});
        }

    } catch (error) {
        console.log(error);
    }

})

module.exports = router;