import request from '@/utils/request'


export function listTextbookInfo(query) {
  return request({
    url: '/textbook/textbookInfo/list',
    method: 'get',
    params: query
  })
}

export function addPublisher(data) {
    return request({
        url: '/textbook/textbookInfo/addPublisher',
        method: 'post',
      data: data
    })
  }
  export function updatePublisher(data) {
    return request({
        url: '/textbook/publisher/updatePublisher',
      method: 'put',
      data: data
    })
  }
  export function getPublisher(publisherId) {
    return request({
      url: '/textbook/publisher/' + publisherId,
      method: 'get'
    })
  }
  export function delPublisher(publisherId) {
    return request({
      url: '/textbook/publisher/delPublisher/' + publisherId,
      method: 'delete'
    })
  }