/**
 * @description 获取表单对象逻辑
 * @param { String } 元素名称 
 */
export const getFormObj = (el) => {
  let formData = $(el).serializeArray()
  let query = {}
  for (let item of formData) {
    query[item.name] = item.value
  }
  return query
}
