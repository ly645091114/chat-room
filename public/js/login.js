import { get, post } from './utils'

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
  console.log(query)
})

