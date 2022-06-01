const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const methodOverride = require('method-override')
const { user } = require('pg/lib/defaults')

//  GET /user/new -- renders a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {msg: null})
})
//  POST /users -- creates a new user & redirects to profile
router.post('/new', async (req, res, next) => {
    try{
        console.log(req.body)
        // try to create the user
        // hash password
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        const [user, created] = await db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: {username: req.body.username, password: hashedPassword}
        })
        // if the user is new
        if (created) {
            // login them in by giving them a cookie
            // res.cookie('cookie name', 'cookie data')
            // encrypt id
            const encryptedId = cryptoJS.AES.encrypt(user.id.toString(), process.env.ENC_KEY).toString()
            res.cookie('userId', encryptedId)
            // redirect to profile
            res.redirect('/users/profile')
        }else {
        // if the user was not created
            // re-render login form w/message for user
            console.log('That email already exists')
            res.render('users/new.ejs', {msg: 'Email already in database. Please login!'})
        }
    } catch (err){
        console.warn('🔥🔥🔥🔥🔥🔥',err)
    }
})


// GET /users/logout -- clear the cookie to log the user out
router.get('/logout', (req, res) => {
    // clear the cookie from storage
    res.clearCookie('userId')
    // redirect to root
    res.redirect('/')
})

router.get('/profile', async (req, res) => {
    try{
        //check if user is authorized
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('user/index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        const savedBooks = await db.book.findAll({
            where:{
                userId: res.locals.user.dataValues.id
            },
            include:db.tag
        })
        // console.log(savedBooks)
        res.render('users/profile.ejs', {user: res.locals.user, savedBooks})
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥',err)
    }
})

// POST -- create new saved book from details pages
router.post('/profile', async (req, res) => {
    try{
       //check if user is authorized
       if (!res.locals.user){
        //if the user is not authorized, ask them to log in
        res.render('user/index.ejs', {msg: 'Please log in to continue'})
        return //end the route here
    }
        await db.book.findOrCreate({
            where:{bookid: req.body.bookid },
            defaults: {
            title: req.body.title,
            author: req.body.author,
            userId: req.body.userId,
            book_cover_url: req.body.books_cover_url
            }
        })
        res.redirect('/users/profile')
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥',err)
    }
})

// DELETE -- allows user to delete a book from their saved books
router.delete('/profile', async (req,res) => {
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('user/index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        console.log("😭😭😭😭😭😭😭😭😭",req.body.id)
        const bookNoMo = await db.book.findOne({
            where:{
                id: req.body.id,
                // userId: req.params.userId
            }
        })
        await bookNoMo.destroy()
        res.redirect('/users/profile')
    } catch(err) {
        console.warn('🔥🔥🔥🔥🔥🔥',err)
    }
})

module.exports = router