import request from '@/router/axios';



export const getDic = (type) => request({
    url: '/admin/getDic',
    method: 'get',
    data: {
        type
    }
})


// 菜单相关的api
export const addMenu = (data) => request({
    url: '/menu',
    method: 'post',
    data
})

export const editMenu = (data,id) => request({
    url: `/menu/${id}`,
    method: 'put',
    data
})

export const delMenu = (id) => request({
    url: `/menu/${id}`,
    method: 'delete'
})

export const getMenuAll = () => request({
    url: '/menu/all',
    method: 'get'
})


//  角色相关

export const getRoleData = (query) => request({
    url: '/roles',
    method: 'get',
    params: {
        query
    }
})

export const addRole = (data) => request({
    url: '/roles',
    method: 'post',
    data
})

export const editRole =  (data) => request({
    url: `/roles/${data._id}`,
    method: 'put',
    data
})

export const delRole = (id) => request({
    url:`/roles/${id}`,
    method: 'delete'
})

// 用户管理相关的api

export const getUserData = (query) => request({
    url: '/users',
    method: 'get',
    params: {
        query
    }
})

export const addUser = (data) => request({
    url: '/users',
    method: 'post',
    data
})

export const editUser = (data) => request({
    url: `/users/${data._id}`,
    method: 'put',
    data
})

export const delUser = (id) => request({
    url: `/users/${id}`,
    method: 'delete'
})
