import {
  DIC
} from '@/const/dic'
export const userOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  selection: false,
  menuBtn: true,
  menuAlign: 'center',
  dicData: DIC,
  printBtn: true,
  excelBtn: true,
  align: 'center',
  column: [{
      label: "用户名",
      prop: "username",
      rules: [{
        required: true,
        message: "请输入用户名",
        trigger: "blur"
      }]
    },
    {
      label: "密码",
      prop: "password",
      hide: true,
      rules: [{
        required: true,
        message: "请输入密码",
        trigger: "blur"
      }]
    },
    {
      label: "性别",
      prop: "sex",
      dicData: DIC.SEX,
      type: "radio",
      valueDefault: "男"
    },
    {
      label: "状态",
      prop: "status",
      slot: true,
      dicData: DIC.STATE,
      type: "switch",
      valueDefault: true
    },
    {
      label: "部门",
      prop: "department",
      dicUrl: `http://xswhb.cn:3000/departments`,
      props: {
        label: "name",
        value: "name"
      },
      type: "select",
      rules: [{
        required: true,
        message: "请选择所在部门",
        trigger: "blur"
      }]
    },
    {
      label: "手机号",
      prop: "phone",
      rules: [{
        required: true,
        message: "请输入手机号",
        trigger: "blur"
      }]
    },
    {
      label: "角色",
      prop: "role",
      type: "tree",
      multiple: true,
      dicUrl:'/roles',
      props:{
        label: 'name',
        value: '_id'
      },
      rules: [
        {
          required: true,
          message: "请选择角色"
        }
      ],
      span: 24,
      hide: true
    },
    {
      label: "备注",
      prop: "remark",
      span: 24,
      type: "textarea"
    }
  ]
};

export const roleOption = {
  title: "角色管理",
  border: true,
  align: "center",
  menuAlign: "center",
  index: true,
  indexLabel: "序号",
  printBtn: true,
  excelBtn: true,
  column: [{
      label: "角色名称",
      prop: "name"
    },
    {
      label: "创建人",
      prop: "createUser"
    },
    {
      label: "创建时间",
      prop: "createdAt",
      type: "date",
      format: "yyyy-MM-dd HH:mm:ss",
      valueFormat: "yyyy-MM-dd HH:mm:ss"
    },
    {
      label: "角色描述",
      prop: "description"
    }
  ],
  group: [{
    column: [{
        label: "角色名称",
        prop: "name",
        type: "input",
        rules: [{
          required: true,
          message: "请输入角色名称",
          trigger: "blur"
        }]
      },
      {
        label: "角色描述",
        prop: "description",
        type: "input",
        rules: [{
          required: true,
          message: "请输入角色描述",
          trigger: "blur"
        }]
      },
      {
        label: '菜单权限',
        prop: 'menu',
        type: 'tree',
        multiple: true
      }
    ]
  }]
};