const express = require('express')
const router = express.Router()
const db = require('../models')

//  GET /user/new -- renders a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {msg: null})
})
//  POST /users -- creates a new user & redirects to index
router.post('/', async (req, res) => {
    try{
        // try to create the user
        // TODO: hash password
        const [user, created] = await db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: {password: req.body.password}
        })
        // if the user is new
        if (created) {
            // login them in by giving them a cookie
            // res.cookie('cookie name', 'cookie data')
            // TODO: encrypt id
            res.cookie('userId', user.Id)
            // redirect to homepage (in future redirect elsewhere like profile)
            res.redirect('/')
        }else {
        // if the user was not created
            // re-render login form w/message for user
            console.log('That email already exists')
            res.render('users/new.ejs', {msg: 'email already exists in database 🤦🏼‍♀️'})
        }
    } catch (err){
        console.log('🔥', err)
    }
})

// GET /users/login -- renders a login form
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {msg: null})
})
// POST /users/login -- authenticates user credentials against database
router.post('/login', async(req, res) => {
    try{
        // look up the user in the db based on their email
        const foundUser = await db.user.findOne({
            where: {email: req.body.email}
        })
        const msg = 'bad login credentials, you are not authenticated!'
        // if the user is not found -- display the login form & give them a message
        if(!foundUser){
            console.log('email not found on login 🤦🏼‍♀️')
            res.render('users/login.ejs', {msg})
            return //do not continue with the function
        }
        // otherwise, check provided password against password in database
        // hash the password from the req.body & compare to the db password
        if(foundUser.password === req.body.password){
            // if they match -- send the user a cookie! to log them in
            res.cookie('userId', foundUser.Id)
            // TODO: redirect to profile
            res.redirect('/')
        } else{
            // if not -- render the login form with a message
            res.render('users/login.ejs', {msg})
        }

    }catch(err){
        console.log('🔥',err)
    }
})
// GET /users/logout -- clear the cookie to log the user out
router.get('/logout', (req, res) => {
    // clear the cookie from storage
    res.clearCookie('userId')
    // redirect to root
    res.redirect('/')
})



module.exports = router