import request from '@/router/axios';


export const getAllPlans = (type) => request({
  url: `/needsplans/tree/?type=${type}`,
  method: 'get'
})


export const saveGoodsNeed = (data) => request({
  url: '/goodsneeds',
  method: 'post',
  data
})


export const getGoodsSelect = (title) => request({
  url: `/goods/select?title=${title}`,
  method: 'get'
})


export const getOnePlan = (id) => request({
  url: `/needsplans/${id}`,
  method: 'get'
})




export const updateGoodsNeed = (id, data) => request({
  url: `/goodsneeds/${id}`,
  method: 'put',
  data
})


export const deleteGoodsNeed = (id) => request({
  url: `/goodsneeds/${id}`,
  method: 'delete'
})



export const updateOne = (id, data) => request({
  url: `/needsplans/${id}`,
  method: 'put',
  data
})


export const createdOne = (data) => request({
  url: '/needsplans',
  method: 'post',
  data
})


export const deleteOne = (id) => request({
  url: `/needsplans/${id}`,
  method: 'delete'
})



export const getAll = () => request({
  url: '/needsplans',
  method: 'get'
})


export const getAllByQuery = (query) => request({
  url: `/needsplans?query=${query}`,
  method: 'get'
})


export const createLog = (data) => request({
  url: '/systeminfos',
  method: 'post',
  data
})


export const getLog = (id) => request({
  url: `/systeminfos/process?id=${id}`,
  method: 'get'
})


export const getCollection = () => request({
  url: '/needsplans/collection',
  method: 'get'
})