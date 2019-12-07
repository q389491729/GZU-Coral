import Mock from 'mockjs'

/**
 * 
 * 动态模拟菜单
 * 
 * label菜单的名字
 * path菜单的路径
 * icon菜单的图标（系统采用的阿里巴巴图表库）
 * compnent组件的地址
 * children子类菜单数组
 * group配置其他路由激活菜单高亮
 */

var top = [{
    label: "首页",
    href: "/wel/index",
    icon: 'el-icon-menu',
    parentId: 0
  },
  {
    label: "设置",
    icon: 'el-icon-setting',
    href: '/dev/index',
    parentId: 1
  }
]
const first = [
  {
    id: 1,
    label: '需求管理',
    icon: 'icon-quanxian',
    path: '/plan',
    meta:{},
    children: [
      {
        id: 2,
        label: '年度计划',
        icon: 'icon-quanxian',
        path: 'year',
        component: 'views/plan/year',
        group: [
          '/plan/year'
        ],
        children:[]
      },
      {
        id: 3,
        label: '月度计划',
        icon: 'icon-quanxian',
        path: 'month',
        component: 'views/plan/month',
        group: [
          '/plan/month'
        ],
        children:[]
      },
      {
        id: 4,
        label: '紧急计划',
        icon: 'icon-quanxian',
        path: 'urgent',
        component: 'views/plan/urgent',
        group: [
          '/plan/urgent'
        ],
        children:[]
      },
      {
        id: 5,
        label: '需求汇总',
        icon: 'icon-quanxian',
        path: 'collection',
        component: 'views/plan/collection',
        group: [
          '/plan/collection'
        ],
        children:[]
      }
    ]
  }
]
// {
//   id: 13,
//   label: "权限测试页",
//   path: '/role',
//   icon: 'icon-quanxian',
//   component: 'views/role',
//   children: [],
// }, {
//   id: 7,
//   label: "阿里图标",
//   path: '/iconfont',
//   icon: 'icon-changyonglogo27',
//   component: 'views/iconfont/index',
//   meta: {},
//   children: []
// }, {
//   id: 2,
//   label: "第三方网站",
//   path: '/url',
//   icon: 'icon-iframe',
//   meta: {},
//   children: [{
//     id: 3,
//     label: "avue官网",
//     path: 'https://avuejs.com',
//     icon: 'el-icon-document',
//     children: [],
//   }, {
//     id: 3,
//     label: "百度",
//     path: 'https://www.baidu.com',
//     icon: 'icon-baidu1',
//     children: [],
//   }, {
//     id: 4,
//     label: "搜狐",
//     path: 'http://www.shouhu.com',
//     icon: 'icon-souhu',
//     children: [],
//   }, {
//     id: 5,
//     label: "360",
//     path: 'http://www.360.com',
//     icon: 'icon-msnui-360',
//     children: [],
//   }]
// }
const second = [
  {
    id: 20,
    label: "用户管理",
    path: '/dev',
    component: 'views/admin/user/index',
    icon: 'icon-yonghuguanli',
    children: []
  }, 
  {
    id: 21,
    label: "角色管理",
    path: '/admin/role',
    component: 'views/admin/role/index',
    icon: 'icon-jiaoseguanli',
    children: []
  },
  {
    id: 10,
    label: '菜单管理',
    icon: 'icon-quanxian',
    path: '/menu',
    meta:{},
    component: 'views/option/menu/index',
    children:[]
  }
]
// ], {
//   id: 15,
//   label: "高级路由",
//   path: '/advanced-router',
//   icon: 'icon-iconset0265',
//   meta: {},
//   children: [{
//     id: 16,
//     label: "动态路由",
//     path: 'mutative-router',
//     component: 'views/advanced-router/mutative-router',
//     icon: 'icon-dongtai',
//     //配置某些路由激活菜单高亮
//     group: [
//       '/advanced-router/mutative-detail'
//     ],
//     children: []
//   }, {
//     id: 17,
//     label: "参数路由",
//     path: 'argument-page',
//     component: 'views/advanced-router/argument-page',
//     icon: 'icon-canshu',
//     group: ['/advanced-router/argument-detail'],
//     children: []
//   }, ]
// }, {
//   id: 8,
//   label: "综合错误",
//   path: '/logs',
//   icon: 'icon-cuowu',
//   meta: {},
//   children: [{
//     id: 15,
//     label: "错误页面",
//     path: 'page',
//     component: 'page/logs/page',
//     icon: 'icon-cuowutishitubiao',
//     children: []
//   }, {
//     id: 15,
//     label: "错误日志",
//     path: 'error',
//     component: 'page/logs/error',
//     icon: 'icon-cuowutishitubiao',
//     children: []
//   }]
export default ({
  mock
}) => {
  if (!mock) return;
  let menu = [first, second];
  Mock.mock('/user/getMenu', 'get', (res) => {
    let body = JSON.parse(res.body);
    return {
      data: menu[body.type] || []
    }
  })
  Mock.mock('/user/getTopMenu', 'get', () => {
    return {
      data: top
    }
  })
}