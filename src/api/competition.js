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
