const express = require('express')
const router = express.Router()
const Room = require('../models/room')

router.get('/', (req, res, next) => { // 大厅
  res.render('hall.html', {
    user: req.session.user
  })
})

router.use('/room/', async (req, res, next) => { // 聊天室
  const roomId = req.url.slice(1)
  Room.findOne({
    _id: roomId,
    status: 1
  }, (error, data) => {
    if (data) { // 查看当前有没有该房间
      return res.render('room.html', {
        user: req.session.user,
        type: 'hall',
        title: `${data.name} - 吃瓜茶楼`,
        roomName: data.name
      })
    }
    res.redirect('/roomerror') // 没有该房间跳转提示页
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
