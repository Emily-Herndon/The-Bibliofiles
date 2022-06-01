const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios =require('axios')
const { user } = require('pg/lib/defaults')


// const url = `https://openlibrary.org/search.json?q=${req.query.bookSearch}`

//GET -- pulls the api and renders search results
router.get('/results', async (req, res) => {
    try{
           //check if user is authorized
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('user/login.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        const url = `https://openlibrary.org/search.json?q=${req.query.bookSearch}`
        const search = await axios.get(url)
        const results= search.data.docs
        // console.log(results)
        res.render('books/results.ejs', {results})

    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }

})


// GET -- shows detailed info on specific book and allows it to be saved & tagged
router.get('/details/works/:id', async (req, res) => {
    // console.log(req.params.id, '😭')
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('user/login.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        
        // console.log(req.params.id)
        const url = `https://openlibrary.org/works/${req.params.id}.json`
        const results = await axios.get(url)
        const details = results.data
        const author = details.authors[0].author.key
        const authorUrl = `https://openlibrary.org/${author}.json`
        const authorDeets = await axios.get(authorUrl)
        // console.log(authorDeets)
        const savedBook = await db.book.findOne({
            where: {
                bookid: details.key,
                userId: res.locals.user.dataValues.id
            }
        })
        res.render('books/details.ejs', {details, author:authorDeets.data, user:res.locals.user, savedBook})
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
})

// PUT -- allows user to update tags on saved books
router.put('/details/works/:id', async (req,res) => {
    try{
        const [foundBook, found] = await db.book.findByPk(req.params.id)
        const [foundOrCreatedTag, createdTag] = await db.tag.findOrCreate({
            where:{
                userId: res.locals.user.dataValues.id,
                title: req.body.title
            }
        })
        foundBook.addTag(foundOrCreatedTag)
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
})













module.exports = router