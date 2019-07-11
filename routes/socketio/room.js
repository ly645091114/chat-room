/**
 * @description 聊天室 socket 相关逻辑
 */
const lodash = require('lodash') 
const Room = require('../../models/room')

/**
 * @description 获取发送信息对象
 * @param { Number } type 信息类型
 * @param { Object } user 用户信息
 * @param { String } msg 发送信息
 * @param { Object } roomInfo 房间信息
 * @returns { Object } 对象信息
 */
const chatObj = (type, user, msg, roomInfo) => {
  let onLineNum = roomInfo.user_list.filter(item => item.status === 1).length
  let obj = {
    type: type,
    name: user.name,
    userId: user._id,
    message: msg,
    time: new Date(),
    onLineNum
  }
  if (type === 1) {
    obj.name = ''
    obj.userId = '0'
  }
  return obj
}

/**
 * @description 发送列表更新信息
 * @param { Object } io socketio
 * @param { Object } roomInfo 聊天室信息 
 */
const sendUpdate = (io, roomInfo) => {
  if (roomInfo.type === 1) { // 如果是大厅则向客户端发送重新请求数据的信息
    io.emit('hallList', 'updateList')
  }
}

/**
 * @description 用户发送消息保存聊天记录逻辑
 * @param { Object } io socketio
 * @param { Object } chatObj 发送信息对象
 * @param { String } msg 聊天室 id
 */
const sendMessage = async (io, chatObj, msg) => {
  let roomInfo = await Room.findOne({ // 获取聊天室的相关信息
    _id: msg
  })
  let chatList = lodash.cloneDeep(roomInfo.chat_record)
  chatList.push(chatObj) // 保存聊天记录
  await Room
    .updateOne({
      _id: msg
    }, { // 更新用户列表
      chat_record: chatList
    })
  io.sockets.in(msg).emit('chat message', chatObj)
}

/**
 * @description 聊天室逻辑
 * @param { Object } io socketio
 * @param { Object } req 请求体
 * @param { Object } socket 当前监听对象
 * @param { Any } msg 请求信息
 */
const roomEvent = async (io, req, socket, msg) => { // 监听到获取列表信息
  socket.join(msg)
  let roomInfo = await Room.findOne({ // 获取聊天室的相关信息
    _id: msg
  })
  socket.on('chat message', (usermsg) => { // 用户发送消息逻辑
    let resObj = chatObj(2, user, usermsg, roomInfo) // 向聊天室发送用户进入消息
    sendMessage(io, resObj, msg)
  })
  const user = req.session.user // 获取用户信息
  if (!user) return false // 没有用户信息直接返回
  let userList = lodash.cloneDeep(roomInfo.user_list)  // 获取聊天室的用户列表
  let userMatch = userList.filter(item => item.id === user._id) // 查看聊天室是否拥有该用户
  if (userMatch.length > 0) { // 如果存在该用户则将其状态改为 1
    userList = userList.map(item => {
      if (item.id === user._id) {
        item.status = 1
      }
      return item
    })
  } else { // 不存在则新增该用户
    userList.push({
      id: user._id,
      name: user.name,
      status: 1,
      join: new Date()
    })
  }
  await Room
    .updateOne({
      _id: msg
    }, { // 更新用户列表
      user_list: userList
    })
    .then(async () => {
      roomInfo = await Room.findOne({ // 获取聊天室的相关信息
        _id: msg
      })
    })
  sendUpdate(io, roomInfo)
  let resObj = chatObj(1, user, `${ user.name } 加入聊天室`, roomInfo) // 向聊天室发送用户进入消息
  io.sockets.in(msg).emit('chat message', resObj)
  socket.on('disconnect', () => { // 离开聊天室逻辑
    userLeave(io, req, socket, msg)
  })
}

/**
 * @description 用户离开聊天室逻辑
 * @param { Object } io socketio
 * @param { Object } req 请求体
 * @param { Object } socket 当前监听对象
 * @param { Any } msg 请求信息
 */
const userLeave = async (io, req, socket, msg) => {
  const user = req.session.user // 获取用户信息
  let roomInfo = await Room.findOne({ // 获取聊天室的相关信息
    _id: msg
  })
  let userList = lodash.cloneDeep(roomInfo.user_list)  // 获取聊天室的用户列表
  userList = userList.map(item => { // 将用户状态改为 0
    if (item.id === user._id) {
      item.status = 0
    }
    return item
  })
  await Room
    .updateOne({
      _id: msg
    }, { // 更新用户列表
      user_list: userList
    })
    .then(async () => {
      roomInfo = await Room.findOne({ // 获取聊天室的相关信息
        _id: msg
      })
    })
  let resObj = chatObj(1, user, `${ user.name } 离开聊天室`, roomInfo) // 向聊天室发送用户进入消息
  io.sockets.in(msg).emit('chat message', resObj)
  userList = lodash.cloneDeep(roomInfo.user_list)  // 获取聊天室的用户列表
  if (userList.filter(item => item.status === 1).length === 0) { // 如果聊天室没有在线客户，则关闭聊天室
    await Room
    .updateOne({
      _id: msg
    }, {
      status: 2
    })
  }
  sendUpdate(io, roomInfo)
}

module.exports = roomEvent
