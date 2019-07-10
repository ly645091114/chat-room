const socket_io = require('socket.io')
const path = require('path')
const appModel = require(path.resolve(__dirname, '../../app'))
const sessionMiddleware = appModel.sessionMiddleware
const roomList = require(path.resolve(__dirname, 'room-list'))

let socketio = {}

socketio.getSocketio = (server) => {
  const io = socket_io.listen(server)
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next)
  })
  io.sockets.on('connection', function (socket) {
    let req = socket.request
    let user = socket.request.session.user || {}
    socket.on('hallList', (msg) => {
      roomList(io, req, 1, msg)
    })
    socket.on('chat message', function (msg) {
      console.log(msg)
      user.message = msg.message
      socketio.emit('chat message', user)
    })
  })
  return io
}

module.exports = socketio
