import md5 from 'blueimp-md5'

/**
 * @description 输入框失焦触发事件
 * @param { String } name 模块名称 
 */
const blurInput = function (name) {
  $(`#register-${name}`).blur(function () {
    let self = this
    if (!self.value) {
      $(`#check-${name}`).addClass('check-show')
    } else {
      $(`#check-${name}`).removeClass('check-show')
    }
  })
}

blurInput('username')
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
    return false
  } else if (!query.password) {
    $('#check-username').removeClass('check-show')
    $('#check-password').addClass('check-show')
    return false
  }
  $('#check-username').removeClass('check-show')
  $('#check-password').removeClass('check-show')
  query.password = md5(query.password) // 密码传参加密
  $.post('/register.do', query, (data) => {
    console.log(data)
  })
})

