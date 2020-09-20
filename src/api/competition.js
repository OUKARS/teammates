import request from '@/utils/request'

export function getCompetitionList(page) {
  return request({
    url: '/competition',
    method: 'get',
    params: {
      page: page
    }
  })
}
export function postCompetition(form) {
  return request({
    url: '/competition',
    method: 'post',
    data: form
  })
}
export function deleteCompetition(comp_id) {
  return request({
    url: '/competition/'+comp_id,
    method: 'delete',
  })
}
