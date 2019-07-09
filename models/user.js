const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 构建用户文档模型
 */
let userSchema = new Schema({
  username: { // 身份
    type: String,
    required: true
  },
  name: String, // 称呼
  password: { // 口令
    type: String,
    required: true
  },
  create_time: { // 创建时间
    type: Date,
    default: Date.now
  },
  last_modified_time: { // 更新时间
    type: Date,
    default: Date.now
  },
  status: { // 用户状态 1.正常; 2.删除
    type: Number,
    enum: [1, 2],
    default: 1
  }
})

module.exports = mongoose.model('User', userSchema)
