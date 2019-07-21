const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 构建留言板文档模型
 */
const messageSchema = new Schema({
  name: { // 用户昵称
    type: String,
    required: true
  },
  user_id: { // 用户 Id
    type: String,
    required: true
  },
  message: { // 留言
    type: String,
    required: true
  },
  create_time: { // 留言时间
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('message', messageSchema)
