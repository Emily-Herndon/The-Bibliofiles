const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios =require('axios')
const { Op } = require("sequelize");


//GET -- pulls the api and renders search results
router.get('/results', async (req, res) => {
    try{
           //check if user is authorized
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('user/index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // api search
        const url = `https://openlibrary.org/search.json?q=${req.query.bookSearch}`
        const search = await axios.get(url)
        const results= search.data.docs
        res.render('books/results.ejs', {results})
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }

})

// GET -- shows detailed info on specific book and allows it to be saved & tagged
router.get('/works/:id', async (req, res) => {
    // console.log(req.params.id, '😭')
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // api search for specific work
        const url = `https://openlibrary.org/works/${req.params.id}.json`
        const results = await axios.get(url)
        const details = results.data
        // get author "key" from details
        const author = details.authors[0].author.key
        // api search for author key
        const authorUrl = `https://openlibrary.org/${author}.json`
        const authorDeets = await axios.get(authorUrl)
        // console.log(authorDeets)
        // find if the book has been saved to the db for this user 
        const savedBook = await db.book.findOne({
            where: {
                bookid: details.key,
                userId: res.locals.user.dataValues.id
            }
        })
        // find all tags this user has created and include the books
        const tags = await db.tag.findAll({
            where:{
                userId: res.locals.user.dataValues.id
            },
            include: [db.book]
        })
        // filter all of this user's tags to retun only the ones associated with this book
        const relevantTags = tags.filter((tag)=> {
            return tag.dataValues.books.some((book)=>{
                return book.dataValues.bookid === details.key
            })
        })
        // filter all of this user's tags to retun only the ones NOT associated with this book
        const nonRelevantTags = tags.filter((tag)=> {
            const bookKeys = tag.dataValues.books.map((book) => {
                // console.log(book)
                return book.dataValues.bookid
            })
            // console.log(bookKeys)
            return !bookKeys.includes(details.key)
        })
        // console.log(nonRelevantTags)
        // console.log(savedBook.id, '🤦🏼‍♀️')
        res.render('books/details.ejs', {details, author:authorDeets.data, user:res.locals.user, savedBook, relevantTags, tags, nonRelevantTags})
        
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
})

// POST -- allows user to create and add tags to saved books
router.post('/works/:id', async (req,res) => {
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // console.log(req.body.bookId,'😭😭😭')
        // find the book that is displayed
        const foundBook = await db.book.findByPk(req.body.bookId)
        // search all tags created by this user and with the tag "title" input
        // if none found create one
        const [foundOrCreatedTag, createdTag] = await db.tag.findOrCreate({
            where:{
                userId: res.locals.user.dataValues.id,
                title: req.body.title
            }
        })
        // add the tag to the book through the join table
        foundBook.addTag(foundOrCreatedTag)
        res.redirect(`/books${req.body.bookKey}`)
        // console.log(foundOrCreatedTag)
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
})

// PUT -- edit tags on a book
router.put('/works/:id', async (req,res) => {
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // take the array of all the ids of the tags the user wants to apply
        let tagIdsToApply = req.body['id[]']
        if(!Array.isArray(req.body['id[]'])){
            tagIdsToApply = []
            tagIdsToApply.push(req.body['id[]'])
        }
        console.log(tagIdsToApply, '🌐')
        // find the book in the db by the id of the one on display
        const foundBook = await db.book.findByPk(req.body.bookId)
        // find all tags associated with this user
        const removeAllTags = await db.tag.findAll({
            where: {
                userId: res.locals.user.dataValues.id
            }
        })
        // remove all tags associated with this user and remove them from this book
        foundBook.removeTags(removeAllTags)
        // find all the tags associated w/current user that have ids matching the ones the user wants to apply
        const foundTagsToApply = await db.tag.findAll({
            where: {
                userId: res.locals.user.dataValues.id,
                id: {[Op.or]:tagIdsToApply}
            }
        })
        // apply all the tags with the ids the user wants to apply to the book
        foundBook.addTags(foundTagsToApply)
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
    // redirect to this books details page
      res.redirect(`/books${req.body.bookKey}`)
})

module.exports = router