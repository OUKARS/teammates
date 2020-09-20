import request from '@/utils/request'

export function getTagList(page) {
  return request({
    url: '/tag',
    method: 'get',
    params: {
      page: page
    }
  })
}
export function editTag(tag_id,tag_name) {
  return request({
    url: '/tag/' + tag_id,
    method: 'put',
    data: {
      name: tag_name
    }
  })
}
export function postTag(tag_name) {
  return request({
    url: '/tag',
    method: 'post',
    data: {
      name: tag_name
    }
  })
}
export function deleteTag(tag_id) {
  return request({
    url: '/tag/' + tag_id,
    method: 'delete'
  })
}
