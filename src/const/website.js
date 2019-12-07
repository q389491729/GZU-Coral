/**
 * 全局配置文件
 */
export default {
    title: "GZU-Coral",
    logo: "G",
    indexTitle: 'GZU-Coral',
    lockPage: '/lock',
    tokenTime: 6000,
    info: {
        title: "GZU-Coral团队 一码当先参赛作品",
        list: [
            '用户权限管理',
            '需求计划管理',
            '采购计划管理',
            '采购订单管理'
        ]
    },
    //http的status默认放行不才用统一处理的,
    statusWhiteList: [400],
    //配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: "首页",
        value: "/wel/index",
        params: {},
        query: {},
        group: [],
        close: false
    },
    //配置菜单的属性
    menu: {
        props: {
            label: 'label',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}