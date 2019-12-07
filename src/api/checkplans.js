import request from '@/router/axios';


export const createOne = (data) => request({
    url: '/checkplans',
    method: 'post',
    data
  })



export const getOne = (id) => request({
    url: `/checkplans?query={"where": {"needsplan": "${id}"}}`,
    method: 'get',
  })




