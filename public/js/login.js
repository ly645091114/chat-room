import { get, post } from './utils'

$('#register-submit').on('click', function (e) {
  e.preventDefault()
  let formData = $('#register-form').serializeArray()
  let query = {}
  for (let item of formData) {
    query[item.name] = item.value
  }
  console.log(query)
})
// get('/register', {}, function (error, data) {
//   console.log(data)
// })
