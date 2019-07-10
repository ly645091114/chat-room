const express = require('express')
const router = express.Router()
const Room = require('../models/room')

router.get('/', (req, res, next) => { // 大厅
  res.render('hall.html', {
    user: req.session.user
  })
})

router.use('/room/', (req, res, next) => { // 聊天室
  res.render('room.html', {
    user: req.session.user
  })
})

router.get((req, res, next) => { // 未登录无法访问以下页面
  if (!req.session.user) {
    return res.redirect('/')
  }
  next()
})

router.get('/createroom', (req, res, next) => { // 新建聊天室
  res.render('create-hallroom.html', {
    user: req.session.user
  })
})

router.post('/createroom.do', async (req, res, next) => { // 新建聊天室提交
  let body = req.body
  let list = await Room.findOne({
    name: body.name,
    status: 1,
    type: 1
  })
  if (list) {
    return res.status(200).json({
      code: 400,
      message: '这个话题大家现在正在讨论呀~'
    })
  }
  let user = req.session.user
  let query = {
    name: body.name,
    create_user: user.name,
    create_user_id: user._id
  }
  new Room(query)
    .save()
    .then((room) => {
      res.status(200).json({
        code: 200,
        data: room._id
      })
    })
})

module.exports = router
