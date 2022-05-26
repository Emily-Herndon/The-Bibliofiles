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


module.exports = router