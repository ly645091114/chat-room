const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const MongoStore = require('connect-mongo')(session)

const app = express()

try {
  mongoose.connect('mongodb://localhost/liaobar', { useNewUrlParser: true }) // 连接数据库
    .then(function () {
      console.log('Connect Success')
    })
} catch (error) {
  console.log(`Connect Error: ${error}`)
}

app.use(cookieParser())

const sessionMiddleware = session({
  secret: 'liaobar', // 匹配加密字符串，在原有加密的基础上拼接加密，目的是为了增加安全性，防止客户端恶意伪造
  name: 'liaobar',
  resave: false,
  saveUninitialized: true, // 无论是否使用 Session，都默认直接分配一把钥匙
  cookie: {
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 * 1000 //默认单位 1000 毫秒
  },
  store: new MongoStore({
    url: 'mongodb://localhost/liaobar'
  })
})

app.use(sessionMiddleware)

app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'dist')))

app.use('/node_modules/', express.static(path.join(__dirname, 'node_modules')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, 'views'))


app.use((req, res, next) => { // 访问时从 cookie 中获取缓存信息
  let user = req.session.user || req.cookies.user
  req.session.user = user
  let visited = req.session.visited || req.cookies.visited
  req.session.visited = visited
  next()
})

app.use('/hall', require(path.join(__dirname, './routes/hall.js'))) // 大厅页面
app.use('/', require(path.join(__dirname, './routes/index.js'))) // 用户操作逻辑挂载在最后

module.exports = {
  app,
  sessionMiddleware
}
