$('#submit-message').on('click', (e) => {
  let $msg = $('#message-input')
  let msg = $msg.val()
  if (msg.trim()) {
    let query = {
      msg
    }
    $.post('/submitMessage.do', query, (data) => {
      if (data.data) {
        location.href = '/message-success'
      }
    })
  }
  $msg.val('')
})
