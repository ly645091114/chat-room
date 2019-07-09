const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  let user = req.session.user || req.cookies.user
  req.session.user = user
  res.render('hall.html', {
    user
  })
})

router.get('/room', (req, res, next) => {
  let user = req.session.user || req.cookies.user
  req.session.user = user
  res.render('room.html', {
    user
  })
})

module.exports = router
