import request from '@/utils/request'

export function getTeamList(page) {
  return request({
    url: '/team',
    method: 'get',
    params: {
      page: page
    }
  })
}
export function postTeam(form) {
  return request({
    url: '/team',
    method: 'post',
    data: form
  })
}
export function editTeam(team_id, form) {
  return request({
    url: '/team/' + team_id,
    method: 'put',
    data: form
  })
}
export function deleteTeam(team_id) {
  return request({
    url: '/team/' + team_id,
    method: 'delete'
  })
}
export function fetchTeamDetail(team_id) {
  return request({
    url: '/team/' + team_id,
    method: 'get'
  })
}
