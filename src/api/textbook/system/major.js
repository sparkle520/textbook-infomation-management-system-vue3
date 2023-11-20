import request from '@/utils/request'


export function listMajor(query) {
  return request({
    url: '/textbook/major/list',
    method: 'get',
    params: query
  })
}

export function addMajor(data) {
    return request({
        url: '/textbook/major/addMajor',
        method: 'post',
      data: data
    })
  }
  export function updateMajor(data) {
    return request({
        url: '/textbook/major/updateMajor',
      method: 'put',
      data: data
    })
  }
  export function getMajor(majorId) {
    return request({
      url: '/textbook/major/' + majorId,
      method: 'get'
    })
  }
  export function delMajor(majorId) {
    return request({
      url: '/textbook/major/delMajor/' + majorId,
      method: 'delete'
    })
  }