import request from '@/router/axios';


export const getList = () => request({
    url: '/store/list',
    method: 'get'
  })



export const updatedStroe = (id,data) => request({
    url: `/store/${id}`,
    data,
    method: 'put'
  })


export const updatedGoodsNeed = (id,data) => request({
    url: `/goodsneeds/${id}`,
    data,
    method: 'put'
  })


export const createdBuyPlan = (data) => request({
    url: '/buy',
    data,
    method: 'post'
  })


export const createdGoodsBuy = (data) => request({
    url: '/goodsbuy',
    data,
    method: 'post'
  })


export const getAll = (query) => request({
    url: `/buy?query=${query}`,
    method: 'get'
  })



export const createLog = (data) => request({
    url: '/systeminfos',
    method: 'post',
    data
  })


export const updateOne = (id,data) => request({
    url: `/buy/${id}`,
    method: 'put',
    data
  })



export const getAllByQuery = (query) => request({
    url: `/buy?query=${query}`,
    method: 'get'
  })
