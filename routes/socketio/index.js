const socket_io = require('socket.io')
const path = require('path')
const appModel = require(path.resolve(__dirname, '../../app'))
const sessionMiddleware = appModel.sessionMiddleware
const roomList = require(path.resolve(__dirname, 'room-list'))
const roomEvent = require(path.resolve(__dirname, 'room'))

let socketio = {}

socketio.getSocketio = (server) => {
  const io = socket_io.listen(server)
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next)
  })
  io.sockets.on('connection', function (socket) {
    let req = socket.request
    let user = socket.request.session.user || {}
    socket.on('hallList', (msg) => { // 大厅聊天室列表事件
      roomList(io, req, 1, msg)
    })
    socket.on('join', (msg) => { // 监听聊天室事件
      roomEvent(io, req, socket, msg)
    })
  })
  return io
}

module.exports = socketio
