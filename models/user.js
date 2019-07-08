const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 构建用户文档模型
 */
let userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
