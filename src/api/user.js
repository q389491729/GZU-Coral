import request from '@/router/axios';
export const loginByUsername = (username, password) => request({
  url: '/auth/login',
  method: 'post',
  data: {
    username,
    password
  }
})

export const getUserInfo = () => request({
  url: '/auth/info',
  method: 'get'
});

export const RefeshToken = () => request({
  url: '/user/refesh',
  method: 'post'
})

export const getTopMenu = () => request({
  url: '/menu/own',
  method: 'get',
  params:{
    type: 0
  }
});

// 待完成 需要完成查询对应用户的权限
export const getMenu = (type = 1) => {
  return request({
    url: '/menu/own',
    method: 'get',
    params:{
      type
    }
  })
};

export const getMenuAll = () => request({
  url: '/user/getMenu',
  method: 'get',
  data: {
    type: 0
  }
});

export const getTableData = (page) => request({
  url: '/users',
  method: 'get'
});

export const logout = () => request({
  url: '/user/logout',
  method: 'get'
})