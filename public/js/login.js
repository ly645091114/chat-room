import md5 from 'blueimp-md5'

/**
 * @description 输入框失焦触发事件
 * @param { String } name 模块名称 
 * @param { Boolean } check 是否校验
 */
const blurInput = function (name, check) {
  check = check || true
  $(`#register-${name}`).blur(function () {
    let self = this
    if (check && !self.value) {
      $(`#check-${name}`).addClass('check-show')
      $(`#check-${name}`).html(name === 'username' ?
        '客官烦请留下身份，好让小的记住您' :
        '行走江湖若无口令证明，岂不被小人冒名顶替，毁您声誉')
    } else {
      $(`#check-${name}`).removeClass('check-show')
    }
  })
}

blurInput('username')
blurInput('name', false)
blurInput('password')

/**
 * 注册用户功能
 */
$('#register-submit').on('click', function (e) {
  e.preventDefault()
  let formData = $('#register-form').serializeArray()
  let query = {}
  for (let item of formData) {
    query[item.name] = item.value
  }
  if (!query.username) {
    $('#check-username').addClass('check-show')
    $('#check-username').html('客官烦请留下身份，好让小的记住您')
    return false
  } else if (!query.password) {
    $('#check-username').removeClass('check-show')
    $('#check-password').addClass('check-show')
    $('#check-password').html('行走江湖若无口令证明，岂不被小人冒名顶替，毁您声誉')
    return false
  }
  $('#check-username').removeClass('check-show')
  $('#check-password').removeClass('check-show')
  query.password = md5(query.password) // 密码传参加密
  $.post('/register.do', query, (data) => {
    if (data.data) {
      location.href = '/success'
    } else if (data.code === 400) {
      let item = $(`#check-${data.repeatProp}`)
      item.html('客官冒名顶替可不好哦~')
      item.addClass('check-show')
    }
  })
})

$('#login-username').focus(() => {
  $('#login-check').removeClass('check-show')
})

$('#login-password').focus(() => {
  $('#login-check').removeClass('check-show')
})

/**
 * 用户登录逻辑
 */
$('#login-submit').on('click', function (e) {
  e.preventDefault()
  let el = $('#login-check')
  let formData = $('#login-form').serializeArray()
  let query = {}
  for (let item of formData) {
    query[item.name] = item.value
    if (!item.value) {
      el.addClass('check-show')
      el.html('客官您这样会让小的很为难')
      return false
    }
  }
  el.removeClass('check-show')
  query.password = md5(query.password) // 密码传参加密
  $.post('/login.do', query, (data) => {
    if (data.data) {
      location.href = '/success'
    } else if (data.code === 400) {
      el.addClass('check-show')
      el.html('没能找到您的信息，请确认信息是否正确')
    }
  })
})

/**
 * 用户推出登录逻辑
 */
$('#logout').on('click', function (e) {
  e.preventDefault()
  $.get('/logout.do', {}, (data) => {
    if (data.data) {
      location.reload()
    }
  })
})
