const express = require('express')
require('dotenv').config()

const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')

const blogsRouter= require('./controllers/blogs')
const middleware =require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


const app = express()



//const Blog = mongoose.model('Blog', blogSchema)

const password = process.argv[2]

const cmlpassword = encodeURIComponent(password)

const url = `mongodb+srv://haran399:${cmlpassword}@cluster0.zs0brxo.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0`
logger.info('connecting to',url)

mongoose
  .connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })
app.use(middleware.tokenExtractor)
//app.use('/api/blogs', middleware.userExtractor, blogsRouter)

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
