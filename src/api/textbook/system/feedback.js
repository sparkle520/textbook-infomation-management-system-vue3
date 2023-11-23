import request from '@/utils/request'


export function listFeedback(query) {
  return request({
    url: '/textbook/feedback/list',
    method: 'get',
    params: query
  })
}

export function addFeedback(data) {
    return request({
        url: '/textbook/feedback/addFeedback',
        method: 'post',
      data: data
    })
  }
  export function listMajor(query) {
    return request({
      url: '/textbook/major/plist',
      method: 'get',
      params: query
    })
  }
  export function updateClass(data) {
    return request({
        url: '/textbook/class/updateClass',
      method: 'put',
      data: data
    })
  }
  export function getClass(classId) {
    return request({
      url: '/textbook/class/' + classId,
      method: 'get'
    })
  }
  export function delFeedback(feedbackId) {
    return request({
      url: '/textbook/feedback/delFeedback/' + feedbackId,
      method: 'delete'
    })
  }