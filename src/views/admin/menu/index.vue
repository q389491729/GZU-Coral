<template>
  <div >
    <basic-container>
      <el-row :span="24">
        <el-col :md="4" :xs="24" :sm="4">
          <avue-tree
            :option="treeOption"
            :data="treeData"
            v-model="treeForm"
            @node-click="handleNodeClick"
          ></avue-tree>
        </el-col>
        <el-col :md="20" :xs="24" :sm="20">
          <avue-crud :data="data" :option="crudOption" v-model="obj"
            @row-save="handleAdd"
            @row-update="handleEdit"
            @row-del="handleDel"
          ></avue-crud>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import { findParent } from "@/util/util";
import { addMenu, editMenu, delMenu, getMenuAll } from '@/api/admin'
export default {
  name: "menu",
  data() {
    return {
      treeForm: {},
      obj: {},
      data: [],
      treeOption: {
        expandAll: true,
        menu: false,
        addBtn: false,
        editBtn: false,
        delBtn: false
      },
      treeData:[]
    };
  },
  created() {
    this.fetch()
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
    formOption() {
      return {
        menuBtn: false,
        labelPosition: "left",
        menuBtn: false,
        menuPostion: "left",
        column: [
          {
            type: "input",
            label: "菜单名称",
            span: 12,
            display: true,
            prop: "label",
            required: true,
            rules: [
              {
                required: true,
                message: "菜单名称必须填写"
              }
            ]
          },
          {
            type: "input",
            label: "父代ID",
            span: 12,
            display: true,
            prop: "parent",
            rules: [],
            placeholder: "",
            required: false,
            readonly: true
          },
          {
            type: "input",
            label: "菜单路由",
            span: 12,
            display: true,
            prop: "path",
            rules: [
              {
                required: true,
                message: "菜单路由必须填写"
              }
            ],
            placeholder: "",
            required: true
          },
          {
            type: "input",
            label: "组件地址",
            span: 12,
            display: true,
            prop: "component",
            rules: [
              {
                required: true,
                message: "菜单路由必须填写"
              }
            ],
            placeholder: "",
            required: true
          },
          {
            type: "input",
            label: "高亮路由",
            span: 12,
            display: true,
            prop: "group",
            rules: [
              {
                required: true,
                message: "菜单路由必须填写"
              }
            ],
            placeholder: "",
            required: true
          },
          {
            type: "select",
            label: "顶部菜单",
            span: 12,
            display: true,
            prop: "type",
            rules: [
              {
                required: true,
                message: "菜单类型必须填写"
              }
            ],
            placeholder: "属于哪一个top栏下面",
            required: true,
            dicData: [
              {
                label: "首页",
                value: "1"
              },
              {
                label: "设置",
                value: "2"
              }
            ],
            size: "medium",
            filterable: false
          }
        ]
      };
    },
    crudOption() {
      return {
        align: "center",
        column: [
          {
            label: 'id',
            display: false,
            prop: '_id'
          },
          {
            type: "input",
            label: "菜单名称",
            span: 12,
            display: true,
            prop: "label",
            required: true,
            rules: [
              {
                required: true,
                message: "菜单名称必须填写"
              }
            ]
          },
          {
            type: 'input',
            label: '父类ID',
            span:12,
            hide: true,
            prop: 'parent'
          },
          {
            type: "input",
            label: "菜单路由",
            span: 12,
            display: true,
            prop: "path",
            rules: [
              {
                required: true,
                message: "菜单路由必须填写"
              }
            ],
            placeholder: "",
            required: true
          },
          {
            type: "input",
            label: "组件地址",
            span: 12,
            display: true,
            prop: "component",
            rules: [
              {
                required: true,
                message: "菜单路由必须填写"
              }
            ],
            placeholder: "",
            required: true
          },
          {
            type: "array",
            label: "高亮路由",
            span: 12,
            display: true,
            prop: "group",
            placeholder: "",
            required: true
          },
          {
            type: "select",
            label: "顶部菜单",
            span: 12,
            display: true,
            prop: "type",
            rules: [
              {
                required: true,
                message: "菜单类型必须填写"
              }
            ],
            placeholder: "属于哪一个top栏下面",
            required: true,
            dicData: [
              {
                label: "首页",
                value: 1
              },
              {
                label: "设置",
                value: 2
              },
              {
                label: ' ',
                value: 0
              }
            ],
            size: "medium",
            filterable: false
          },
          {
            type: "icon-select",
            label: "图标",
            span: 24,
            display: true,
            prop: "icon",
            rules: [
              {
                required: true,
                message: "图标必须填写"
              }
            ],
            iconList: [
              {
                label: "基本图标",
                list: [
                  "el-icon-info",
                  "el-icon-error",
                  "el-icon-error",
                  "el-icon-success",
                  "el-icon-warning",
                  "el-icon-question"
                ]
              },
              {
                label: "方向图标",
                list: [
                  "el-icon-info",
                  "el-icon-back",
                  "el-icon-arrow-left",
                  "el-icon-arrow-down",
                  "el-icon-arrow-right",
                  "el-icon-arrow-up"
                ]
              },
              {
                label: "符号图标",
                list: [
                  "el-icon-plus",
                  "el-icon-minus",
                  "el-icon-close",
                  "el-icon-check"
                ]
              },
              {
                label: "阿里云图标",
                list: [
                  "iconfont icon-zhongyingwen",
                  "iconfont icon-rizhi1",
                  "iconfont icon-bug",
                  "iconfont icon-qq1",
                  "iconfont icon-weixin1"
                ]
              }
            ],
            required: true
          }
        ]
      };
    },
    
  },
  props: [],
  methods: {
    handleNodeClick(data) {
      let result = [];
      result.push(data);
      if ( data.children.length ) result = result.concat(data.children);
      this.data = result;
    },
    async handleAdd(row,done,loading) {
      let result = JSON.parse(JSON.stringify(row))
      delete result.$type
      delete result._id
      if(result.parent === "") delete result.parent
      if(result.group === '') delete result.group
      if(result.component === 'null') delete result.component

      let res = await addMenu(result)
      this.$message('增加成功')
      this.fetch()
      done()
    },
    async handleEdit(row,index,done,loading) {
      let result = JSON.parse(JSON.stringify(row))
      delete result.$index
      delete result.$type
      delete result.is_show
      delete result.meta
      if(result.parent === "") delete result.parent
      if(result.group === '') delete result.group
      console.log(result)
      await editMenu(result,result._id)
      this.$message('修改成功')
      this.fetch()
      done()
    },
    handleDel(row,index) {
      console.log(row)
      this.$confirm(`是否确认删除${row.label}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row._id)
          let data = await delMenu(row._id)
          console.log(data)
          this.fetch()
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          
        })
        .catch(() => {});
    },
    handleSubmit() {

    },
    async fetch(){
      let res = await getMenuAll()
      this.treeData = res.data
      this.data = []
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 0 20px;
}
.menu-header {
  padding: 8px 0;
}
</style>
