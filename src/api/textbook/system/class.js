import request from '@/utils/request'


export function listClass(query) {
  return request({
    url: '/textbook/class/list',
    method: 'get',
    params: query
  })
}

export function addClass(data) {
    return request({
        url: '/textbook/class/addClass',
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
  export function delClass(classId) {
    return request({
      url: '/textbook/class/delClass/' + classId,
      method: 'delete'
    })
  }