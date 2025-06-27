const blogsRouter =require('express').Router()
const jwt = require('jsonwebtoken')

const Blog =require('../models/blog')
const User= require('../models/user')
const { userExtractor } = require('../utils/middleware')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/',async (request,response) =>{
    const blogs=await Blog.find({}).populate('user')
        response.json(blogs)
    })



blogsRouter.get('/:id',(request,response,next)=>{
    Blog.findById(request.params.id).then((blog)=>{
        if(blog){
            response.json(blog)
        }
        else{
            response.status(404).end()
        }
    })
    .catch((error)=>next(error))
})

blogsRouter.post('/',userExtractor,async (request,response,next)=>{
     const body=request.body
  //   const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  //   if (!user) {
  //   return response.status(400).json({ error: 'userId missing or not valid' })
  // }
  const user=request.user
  console.log(user)
    const blog=new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user:user._id
    })
    const savedblog=await blog.save()
    user.blogs=user.blogs.concat(savedblog._id)
    await user.save()
    response.status(201).json(savedblog)
})

blogsRouter.delete('/:id',userExtractor, (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Blog.findById(request.params.id)
    .then((blog) => {
      if (!blog) {
        return response.status(404).end()
      }

      title= body.title
      author= body.author
      url= body.url
      likes=  body.likes

      return blog.save().then((updatedBlog) => {
        response.json(updatedBlog)
      })
    })
    .catch((error) => next(error))
})

module.exports =blogsRouter