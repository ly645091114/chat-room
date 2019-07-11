/**
 * 大厅相关事件
 */
const socket = io()

/**
 * @description 跳转聊天室
 * @param { String } id 聊天室 Id
 */
const linkToRoom = (id) => {
  window.open(`/hall/room/${id}`)
}

/**
 * @description 聊天室模板
 * @param { Object } obj 元素字段 
 */
const itemListFormat = (obj) => {
  return `<div class="room-list__item--title">${obj.name}</div>
    <div class="room-list__item--info">
      <span class="float-left">发起人: ${obj.createUser}</span>
      <span class="float-right">当前人数: ${obj.userNum}</span>
    </div>`
}

socket.emit('hallList', 'getList') // 建立连接后发送获取列表请求
socket.on('hallList', (data) => { // 监听服务端返回的数据列表
  if (data === 'getList') return false // 如果传递的信息为获取列表则不做渲染
  if (data === 'updateList') return socket.emit('hallList', 'getList') // 如果收到的信息是更新列表则再次请求获取新的列表
  let fragment = document.createDocumentFragment() // 创建临时代码片，避免频繁操作 dom
  if (data.length > 0) {
    for (let item of data) {
      let li = document.createElement('li')
      li.className = 'room-list__item'
      li.innerHTML = itemListFormat(item)
      li.onclick = () => {
        linkToRoom(item.id)
      }
      fragment.appendChild(li)
    }
  } else {
    let li = document.createElement('li')
    li.className = 'room-list__empty'
    li.innerHTML = `大厅上好像没有人 ...`
    fragment.appendChild(li)
  }
  $('#room-list').html(fragment)
})
