const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios =require('axios')


// const url = `https://openlibrary.org/search.json?q=${req.query.bookSearch}`

//GET -- pulls the api and renders search results
router.get('/results', async (req, res) => {
    try{
        const url = `https://openlibrary.org/search.json?q=${req.query.bookSearch}`
        const search = await axios.get(url)
        const results= search.data.docs
       
        console.log(results)
        res.render('books/results.ejs', {results})

    }catch(err){
        console.warn('🔥🔥🔥🔥🔥🔥', err)
    }

})


// GET -- shows detailed info on specific book and allows it to be saved & tagged
router.get('/details', async (req, res) => {
    res.render('books/details.ejs')

})

// PUT -- allows user to update tags on saved books
router.put('/details', async (req,res) => {
    res.send('tag all the books')
})


// DELETE -- allows user to delete a book from their saved books
router.delete('/details', async (req,res) => {
    res.send('no mo books')
})










module.exports = router