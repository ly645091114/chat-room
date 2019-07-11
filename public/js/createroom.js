/**
 * 创建聊天室的相关逻辑
 */
import { getFormObj } from './utils'

/**
 * 大厅聊天室相关逻辑
 */
$('#hallroom-submit').on('click', (e) => {
  e.preventDefault()
  let query = getFormObj('#hallroom-form')
  if (!query.name) {
    $('#check-name').addClass('check-show')
    $('#check-name').html('话题可以让他人知道这里正在聊些什么')
    return false
  } else if (query.name.length > 20) {
    $('#check-name').addClass('check-show')
    $('#check-name').html('话题太长可能会遭他人反感')
    return false
  }
  $('#check-name').removeClass('check-show')
  $.post('/hall/createroom.do', query, async (data) => {
    let roomId = data.data
    if (roomId) {
      const socket = io() // 连接 socket
      socket.emit('hallList', 'getList') // 连接成功后告诉 socket 创建了一个房间
      socket.on('hallList', function (res) { // 如果 socket 返回跳转聊天房间
        location.href = `/hall/room/${roomId}`
      })
    } else if (data.code === 400) {
      $('#check-name').addClass('check-show')
      $('#check-name').html(data.message)
    }
  })
})

$('#hallroom-username').focus(() => {
  $('#check-name').removeClass('check-show')
})
