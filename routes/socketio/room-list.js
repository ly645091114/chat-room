const Room = require('../../models/room')
/**
 * @description 获取聊天室列表
 * @param { Object } io socketio
 * @param { Object } req 请求体
 * @param { Number } type 类型
 * @param { Any } msg 请求信息
 */
const roomList = async (io, req, type, msg) => { // 监听到获取列表信息
  if (msg === 'getList') { // 如果是创建房间返回 ok 标识跳转
    let list = await Room.find({
      type,
      status: 1
    }).sort({ _id: '-1' })
    list = list.map((item) => {
      let obj = {
        id: item.id,
        name: item.name,
        createUser: item.create_user,
        createId: item.create_user_id,
        userNum: 0
      }
      if (item.user_list.length > 0) {
        obj.userNum = item.user_list.filter(item => item.status === 1).length
      }
      return obj
    })
    io.emit('hallList', list)
  }
}

module.exports = roomList
