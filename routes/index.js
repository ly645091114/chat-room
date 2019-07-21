const express = require('express')
const router = express.Router()
const md5 = require('blueimp-md5')
const User = require('../models/user')
const Message = require('../models/message')

router.get('/message', (req, res, next) => { // 留言板
  res.render('message.html', {
    user: req.session.user,
    hiddenMsg: true
  })
})

router.get('/message-success', (req, res, next) => { // 留言成功
  res.render('message-success.html', {
    user: req.session.user,
    hiddenMsg: true
  })
})

router.post('/submitMessage.do', async (req, res, next) => { // 留言板提交
  let user = req.session.user
  let query = req.body
  let data = {
    message: query.msg,
    user_id: '0',
    name: '游客'
  }
  if (user) {
    data.user_id = user._id
    data.name = user.name
  }
  await new Message(data) // 保存留言实例
    .save()
  res.status(200).json({
    code: 200,
    data: true
  })
})

router.get('/roomerror', (req, res, next) => { // 聊天室不存在
  res.render('room-error.html', {
    user: req.session.user
  })
})

router.get('/roomclose', (req, res, next) => { // 聊天室不存在
  res.render('room-close.html', {
    user: req.session.user
  })
})

router.get('/logout.do', (req, res, next) => { // 退出登录逻辑
  req.session.user = req.cookies.user = null
  res.status(200).json({
    code: 200,
    data: true
  })
})

router.get('/userInfo.do', (req, res, next) => { // 获取用户信息
  let user = req.session.user
  let resUser = {}
  if (user) {
    resUser = {
      userId: user._id,
      name: user.name,
      username: user.username
    }
  }
  res.status(200).json({
    code: 200,
    data: resUser
  })
})

router.get('/success', (req, res, next) => { // 创建房间成功跳转
  if (req.session.user) {
    return res.render('success.html', {
      user: req.session.user
    })
  }
  res.redirect('/')
})

router.use((req, res, next) => { // 已经登陆过的用户不访问下面请求
  if (req.session.user) {
    return res.redirect('/hall')
  }
  next()
})

router.post('/login.do', (req, res, next) => { // 用户登录逻辑
  let query = req.body
  query.password = md5(query.password)
  query.status = 1
  let nameData = {
    name: query.username,
    password: query.password,
    status: query.status
  }
  User.findOne({
      $or: [query, nameData]
    })
    .then((user) => {
      if (user) {
        req.session.visited = req.cookies.visited = true
        req.session.user = req.cookies.user = user // 登录成功 Session, Cookies 记录用户登录状态
        return res.status(200).json({
          code: 200,
          data: true
        })
      }
      res.status(200).json({
        code: 400
      })
    }, (error) => {
      next(error)
    })
})

router.post('/register.do', async (req, res, next) => { // 用户注册逻辑
  let query = req.body
  if (await User.findOne({ username: query.username, status: 1 })) { // 判断用户名是否重复
    return res.status(200).json({
      code: 400,
      repeatProp: 'username',
      message: '身份已经存在'
    })
  } else if (query.name && await User.findOne({ name: query.name, status: 1 })) { // 判断昵称是否重复
    return res.status(200).json({
      code: 400,
      repeatProp: 'name',
      message: '称呼已经存在'
    })
  }
  if (!query.name) {
    let count = await User.find().estimatedDocumentCount()
    query.name = `无名小辈_${count + 1}`
  }
  query.password = md5(query.password)
  await new User(query) // 保存实例
    .save()
    .then(function (user) {
      req.session.visited = req.cookies.visited = true
      req.session.user = req.cookies.user = user // 注册成功，使用 Session, Cookies 记录用户登录状态
    })
  res.status(200).json({
    code: 200,
    data: true
  })
})

router.get('/', (req, res, next) => { // 首页访问
  if (req.session.visited) {
    return res.redirect('/login')
  }
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/login', (req, res, next) => { // 登录访问
  res.render('login.html', {
    visited: req.session.visited
  })
})

router.get('/register', (req, res, next) => { // 注册访问
  res.render('register.html', {
    visited: req.session.visited
  })
})

module.exports = router
