const socket = io()
$('#send-message').on('click', function (e) {
  e.preventDefault()
  if ($('#message-input').val()) {
    socket.emit('chat message', {
      message: $('#message-input').val()
    })
    $('#message-input').val('')
  }
})
socket.on('chat message', (msg) => {
  let text = $('#show-message').html()
  text = `${text}<br>${msg.message}`
  $('#show-message').html(text)
  console.log(msg)
})
