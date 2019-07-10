const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 构建聊天室文档模型
 */
const roomSchema = new Schema({
  name: { // 聊天室名称
    type: String,
    required: true
  },
  create_user: { // 创建人
    type: String,
    required: true
  },
  create_user_id: { // 创建人 id
    type: String,
    required: true
  },
  create_time: { // 创建时间
    type: Date,
    default: Date.now()
  },
  type: { // 房间类型 1.公开; 2.私密
    type: Number,
    enum: [1, 2],
    default: 1
  },
  password: { // 聊天室密码
    type: String
  },
  chat_record: { // 聊天记录
    type: Array,
    default: []
  },
  user_list: { // 聊天室用户列表
    type: Array,
    default: []
  },
  status: { // 聊天室状态 1.打开; 2.关闭
    type: Number,
    enum: [1, 2],
    default: 1
  }
})

module.exports = mongoose.model('Room', roomSchema)
