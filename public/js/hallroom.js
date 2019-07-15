/**
 * 聊天室相关需求
 */
const socket = io()
import moment from 'moment'

/**
 * @description 系统消息模板
 * @param { Object } data 消息对象
 */
const sysMsgTpl = (data) => {
  return `<div class="sys-message">
    <span>${data.message}</span>
  </div>`
}

/**
 * @description 系统消息模板
 * @param { Object } data 消息对象
 * @param { Object } type 消息来源类型
 */
const userMsgTpl = (data, type) => {
  return `<div class="${type}-user">
    <div class="user-message">
      <span>${data.name}:</span><span>${moment(data.time).format('YYYY-MM-DD HH:mm')}</span>
      <div>${data.message}</div>
    </div>
  </div>`
}

/**
 * @description 渲染消息模板
 * @param { Object } data 消息对象
 * @param { Object } user 用户对象
 */
const renderMessage = (data, user) => {
  if (data.type === 1) {
    $('#message-body').append(sysMsgTpl(data))
  } else {
    let type = user.userId === data.userId ? 'self' : 'other'
    $('#message-body').append(userMsgTpl(data, type))
  }
}

/**
 * @description 消息发送逻辑
 */
const sendMessage = () => {
  let val = $('#message-input').val().trim()
  if (val) {
    socket.emit('chat message', val)
  }
  $('#message-input').val('') // 无论发没发成功都要清空输入框
}

$.get('/userInfo.do', {}, (data) => { // 先获取用户信息
  let user = data.data
  let url = location.pathname
  let roomId = url.split('/').pop()

  socket.emit('join', roomId)
  socket.on('closeroom', (msg) => {
    if (msg) {
      location.href = '/roomclose'
    }
  })
  socket.on('chat message', (msg) => {
    $('#room-online').html(`(${msg.onLineNum}人)`)
    renderMessage(msg, user)
    let scrollHeight = $('#message-body')[0].scrollHeight
    let scrollTop = $('#message-body')[0].scrollTop
    let bodyHeight = $('#message-body').height()
    $('#message-body').scrollTop(scrollHeight) // 新消息滚动时滚动至最大滚动高度
  })

  $("#message-input").keyup((e) => {
    if (e.which === 13) {
      sendMessage()
    }
  })

  $('#send-message').on('click', (e) => {
    e.preventDefault()
    sendMessage()
  })
})
