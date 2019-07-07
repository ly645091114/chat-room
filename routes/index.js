let express = require('express')
let router = express.Router()

router.get('/', (req, res, next) => {
  let user = req.session.user || req.cookies.user
  let isFirst = req.session.isFirst || req.cookies.isFirst
  res.render('index.html', {
    user,
    isFirst
  })
})

router.get('/register', (req, res, next) => {
  res.render('register.html')
})

module.exports = router
