let express = require('express');
let router = express.Router();
let Post = require('../models/Post');
let User = require('../models/User');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';

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

router.post('/admin', async (req, res) => {
    try {
        
        const {username, password} = req.body;

        console.log("Username: " + username);
        console.log("Password: " + password);

        res.redirect('/');

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