require('dotenv').config()
// required packages
const express = require('express')
const rowdy = require('rowdy-logger')
const cookieParser = require('cookie-parser')
const db = require('./models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')

// app config
const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'ejs')

// middlewares
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// DIY middleware
// happens on every request
app.use((req, res, next) => {
  // handy dandy debugging request logger
  console.log(`[${new Date().toLocaleString()}] incoming request: ${req.method} ${req.url}`)
  console.log('request body:', req.body)
  // modify the response to give data to the routes/middleware that is 'downstream'
  res.locals.myData = 'hi, i came from a middleware'
  // tell express that the middleware is done
  next()
})

// auth middleware
app.use(async (req, res, next) => {
  try{
    // if there is a cookie--
    if(req.cookies.userId){
      // try to find that user in the database
      const userId = req.cookies.userId
      const decryptedId = cryptoJS.AES.decrypt(userId, process.env.ENC_KEY).toString(cryptoJS.enc.Utf8)
      const user = await db.user.findByPk(decryptedId)
      // mount the found user on the res.locals so that later routes can access the logged in user
      // any value to the res.locals is available to the layout.ejs
      res.locals.user = user
    }else{
      // the user is explicitly not logged in
      res.locals.user = null
    }
    next()
  }catch(err){
    console.warn('🔥🔥🔥🔥🔥🔥', err)
    // next() //forge ahead in case of error
  }
})

// routes
// app.get('/', (req, res) => {
//   // console.log(res.locals)
//   // throw new Error('oooooops💩')
//   res.redirect('/users/login')
// })

// GET / -- renders a login form
app.get('/', (req, res) => {
  res.render('index.ejs', {msg: null})
})
// POST / -- authenticates user credentials against database
app.post('/', async(req, res, next) => {
  try{
    console.log('⌨️📧💻',req.body.email)
      // look up the user in the db based on their email
      const foundUser = await db.user.findOne({
          where: {email: req.body.email}
      })
      const msg = 'Account not found! Try again or sign up!'
      // if the user is not found -- display the login form & give them a message
      if(!foundUser){
          console.log('email not found on login 🤦🏼‍♀️')
          res.render('index.ejs', {msg})
          return //do not continue with the function
      }
      // otherwise, check provided password against password in database
      // hash the password from the req.body & compare to the db password
      const compare = bcrypt.compareSync(req.body.password, foundUser.password)
      if(compare){
          // if they match -- send the user a cookie! to log them in
          const encryptedId = cryptoJS.AES.encrypt(foundUser.id.toString(), process.env.ENC_KEY).toString()
          res.cookie('userId', encryptedId)
          // redirect to profile
          res.redirect('/users/profile')
      } else{
          // if not -- render the login form with a message
          res.render('index.ejs', {msg})
      }

  }catch(err){
      next(err)
  }
})


//controllers
app.use('/users', require('./controllers/users'))
app.use('/books', require('./controllers/books'))

// 404 error handlers -- NEEDS TO GO LAST  
// app.get('/*', (req, res) => {
//   // render a 404 template
// })

// app.use((req, res, next) => {
//   // render a 404 template
//   res.status(404).render('404.ejs')
// })

// 500 error handler
// need to have all 4 params
app.use((error, req, res, next) => {
  // log the error
  console.log('🔥🔥🔥🔥🔥🔥🔥🔥', error)
  // send a 500 error template
  res.status(500).render('500.ejs')
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  rowdyRes.print()
})