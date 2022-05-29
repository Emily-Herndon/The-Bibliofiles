const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')

//  GET /user/new -- renders a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {msg: null})
})
//  POST /users -- creates a new user & redirects to profile
router.post('/new', async (req, res, next) => {
    try{
        // try to create the user
        // hash password
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        const [user, created] = await db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: {password: hashedPassword}
        })
        
        // if the user is new
        if (created) {
            // login them in by giving them a cookie
            // res.cookie('cookie name', 'cookie data')
            // encrypt id
            const encryptedId = cryptoJS.AES.encrypt(user.id.toString(), process.env.ENC_KEY).toString()
            res.cookie('userId', encryptedId)
            // redirect to homepage (in future redirect elsewhere like profile)
            res.redirect('/users/profile')
        }else {
        // if the user was not created
            // re-render login form w/message for user
            console.log('That email already exists')
            res.render('users/new.ejs', {msg: 'Email already in database. Please login!'})
        }
    } catch (err){
        next(err)
    }
})


// GET /users/logout -- clear the cookie to log the user out
router.get('/logout', (req, res) => {
    // clear the cookie from storage
    res.clearCookie('userId')
    // redirect to root
    res.redirect('/')
})

router.get('/profile', (req, res) => {
    // check if user is authorized
    // if (!res.locals.user){
        // iff the ser is not authorized, ask them to log in
        // res.render('user/login.ejs', {msg: 'Please log in to continue'})
        // return //end the route here
    // }

    res.render('users/profile.ejs') //, {user: res.locals.user})
})



module.exports = router