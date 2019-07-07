$('#register-submit').on('click', function (e) {
  e.preventDefault()
  let formData = $('#register-form').serializeArray()
  let query = {}
  for (let i = 0; i < formData.length; i++) {
    query[formData[i].name] = formData[i].value
  }
  console.log(query)
})
// get('/register', {}, function (error, data) {
//   console.log(data)
// })
