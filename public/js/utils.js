const reqFuction = function (type) {
  return function (url, query, callback) {
    $.ajax({
      url: url,
      type: type,
      data: query,
      success: function (data) {
        callback(null, data)
      },
      error: function (error) {
        callback(error)
      }
    })
  }
}

const get = reqFuction('get')
const post = reqFuction('post')
