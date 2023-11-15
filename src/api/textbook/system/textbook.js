import request from '@/utils/request'


export function listTextbookInfo(query) {
  return request({
    url: '/textbook/textbookInfo/list',
    method: 'get',
    params: query
  })
}

export function addTextbook(data) {
    return request({
        url: '/textbook/textbookInfo/addTextbook',
        method: 'post',
      data: data
    })
  }
  export function updateTextbook(data) {
    return request({
        url: '/textbook/textbookInfo/updateTextbook',
      method: 'put',
      data: data
    })
  }
  export function getTextbook(textbookId) {
    return request({
      url: '/textbook/textbookInfo/' + textbookId,
      method: 'get'
    })
  }
  export function delTextbook(textbookId) {
    return request({
      url: '/textbook/textbookInfo/delTextbook/' + textbookId,
      method: 'delete'
    })
  }