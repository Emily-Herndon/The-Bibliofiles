const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios =require('axios')
const { Op } = require("sequelize");


// const url = `https://openlibrary.org/search.json?q=${req.query.bookSearch}`

//GET -- pulls the api and renders search results
router.get('/results', async (req, res) => {
    try{
           //check if user is authorized
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('user/index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // 
        const url = `https://openlibrary.org/search.json?q=${req.query.bookSearch}`
        const search = await axios.get(url)
        const results= search.data.docs
        // const results = allResults.filter((book => {
        //     return book.has_fulltext === true
        // }))
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
            res.render('index.ejs', {msg: 'Please log in to continue'})
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
        const tags = await db.tag.findAll({
            where:{
                userId: res.locals.user.dataValues.id
            },
            include: [db.book]
        })
        const relevantTags = tags.filter((tag)=> {
            return tag.dataValues.books.some((book)=>{
                return book.dataValues.bookid === details.key
            })
        })
        const nonRelevantTags = tags.filter((tag)=> {
            const bookKeys = tag.dataValues.books.map((book) => {
                // console.log(book)
                return book.dataValues.bookid
            })
            // console.log(bookKeys)
            return !bookKeys.includes(details.key)
        })
        // console.log(nonRelevantTags)
        console.log(savedBook.id, '🤦🏼‍♀️')
        res.render('books/details.ejs', {details, author:authorDeets.data, user:res.locals.user, savedBook, relevantTags, tags, nonRelevantTags})
        
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
})

// POST -- allows user to create and add tags to saved books
router.post('/details', async (req,res) => {
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // console.log(req.body.bookId,'😭😭😭')
        const foundBook = await db.book.findByPk(req.body.bookId)
        const [foundOrCreatedTag, createdTag] = await db.tag.findOrCreate({
            where:{
                userId: res.locals.user.dataValues.id,
                title: req.body.title
            }
        })
        foundBook.addTag(foundOrCreatedTag)
        // const savedBooks = await db.book.findAll()
        
        res.redirect(`/books/details${req.body.bookKey}`)
        // console.log(foundOrCreatedTag)
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
})

// PUT -- edit tags on a book
router.put('/details', async (req,res) => {
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // console.log(req.body,'😭😭😭')
        // const foundBook = await db.book.findByPk(req.body.bookId)
        // const foundTag = await db.tag.findOne({
        //     where:{
        //         userId: res.locals.user.dataValues.id,
        //         title: req.body.title
        //     }
        // })
        // foundBook.addTag(foundTag)
        // // const savedBooks = await db.book.findAll()
        // res.redirect(`/books/details${req.body.bookKey}`)
        // // console.log(foundOrCreatedTag)
        const tagIdsToApply = req.body['id[]']
        console.log(tagIdsToApply, '🌐')
        const foundBook = await db.book.findByPk(req.body.bookId)
        const removeAllTags = await db.tag.findAll({
            where: {
                userId: res.locals.user.dataValues.id
            }
        })
        foundBook.removeTags(removeAllTags)
        const foundTagsToApply = await db.tag.findAll({
            where: {
                userId: res.locals.user.dataValues.id,
                id: {[Op.or]:tagIdsToApply}
            }
        })
        foundBook.addTags(foundTagsToApply)
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
      res.redirect(`/books/details${req.body.bookKey}`)
})

//DELETE -- delete tags from books
router.delete('/details', async (req,res) => {
    try{
        if (!res.locals.user){
            //if the user is not authorized, ask them to log in
            res.render('index.ejs', {msg: 'Please log in to continue'})
            return //end the route here
        }
        // console.log(req.body,'😭😭😭')
        const foundBook = await db.book.findOne({
            where: {
                id:req.body.bookId,
                userId: res.locals.user.dataValues.id
            }
            })
        const foundTag = await db.tag.findOne({
            where: {
                id:req.body.tagId,
                userId: res.locals.user.dataValues.id
            }
        })
        foundBook.removeTag(foundTag)
        res.redirect(`/books/details${req.body.bookKey}`)
        // console.log(foundOrCreatedTag)
    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }
})


module.exports = router