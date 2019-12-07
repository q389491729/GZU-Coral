<template>
  <div>
    <basic-container>
      <avue-crud
        :option="tableOption"
        :data="tableData"
        :table-loading="tableLoading"
        :page="page"
        ref="crud"
        @row-save="handleSave"
        @row-update="handleUpdate"
        @row-del="handleDel"
      ></avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getRoleData,
  getMenuAll,
  editRole,
  delRole,
  addRole
} from "@/api/admin";
import { roleOption } from "@/const/admin/adminTabelOption.js";
export default {
  name: "role",
  components: {},
  data() {
    return {
      tableData: [], //表格的数据
      tablePage: 1,
      tableLoading: false,
      tabelObj: {},
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10 //每页显示多少条
      },
      grade: {
        box: false,
        check: []
      },
      query: {
        limit: 10,
        page: 1
      },
      menuAll: []
    };
  },
  created() {
    //初始化数据格式
    this.handleList();
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters(["permission","userInfo"]),
    tableOption() {
      return {
        title: "角色管理",
        border: true,
        align: "center",
        menuAlign: "center",
        index: true,
        indexLabel: "序号",
        printBtn: true,
        excelBtn: true,
        column: [
          {
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
        group: [
          {
            column: [
              {
                label: "角色名称",
                prop: "name",
                type: "input",
                rules: [
                  {
                    required: true,
                    message: "请输入角色名称",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "角色描述",
                prop: "description",
                type: "input",
                rules: [
                  {
                    required: true,
                    message: "请输入角色描述",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "菜单权限",
                prop: "menu",
                type: "tree",
                multiple: true,
                dicUrl:'/menu/all',
                props:{
                  label: 'label',
                  value: '_id'
                },
                rules: [
                  {
                    required: true,
                    message: "请选择菜单权限"
                  }
                ],
                span: 24
              }
            ]
          }
        ]
      };
    }
  },
  props: [],
  methods: {
    /**
     * @title 权限更新
     *  TODO:
     *  - 获取树中选中的ID
     *  - 调用role的接口，更新角色的权限信息
     *  - 关闭窗口，给予提示
     * 1. grade.check负责树的选择
     * 2. box 负责树的开关
     * 3.
     **/
    async handleGradeUpdate() {
      this.tabelObj.menu = [].concat(this.grade.check);
      let obj = JSON.parse(JSON.stringify(this.tabelObj));
      console.log(obj)
      delete obj.$index;
      delete obj.$menu
      await editRole(obj);
      this.$message.success("更新成功");
      this.tabelObj = {};
      this.grade.check = [];
      this.grade.box = false;
    },
    /**
     * @title 权限选择
     * TODO: 将选中的数据的id加入到 grade.check中
     **/
    handleGradeCheckChange(data, checked) {
      if (checked) {
        this.grade.check.push(data._id);
      } else {
        this.grade.check.splice(this.grade.check.indexOf(data._id), 1);
      }
    },
    /**
     * @title 打开权限
     *  TODO: tableObj 为选中当前的角色信息
     *
     */
    handleGrade(row) {
      getMenuAll().then(res => {
        this.menuAll = res.data;
        this.tabelObj = row;
        this.grade.check = this.tabelObj.menu;
        this.grade.box = true;
      });
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList() {
      this.tableLoading = true;
      getRoleData(this.query).then(res => {
        const data = res.data.data;
        this.tableData = data;
        this.page.total = res.data.total;
        this.tableLoading = false;
      });
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    async handleSave(row, done) {
      let rowData = JSON.parse(JSON.stringify(row))
      delete rowData.$menu
      rowData.createUser = this.userInfo.username
      await addRole(rowData)
      
      this.handleList()
      this.$message({
        showClose: true,
        message: "添加成功",
        type: "success"
      });
      done();
    },
    /**
     * @title 数据删除
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     *
     **/
    handleDel(row, index) {
      this.$confirm(`是否确认删除 ${row.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await delRole(row._id);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.handleList();
        })
        .catch(() => {});
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    async handleUpdate(row, index, done) {
      let rowData = JSON.parse(JSON.stringify(row));
      delete rowData.$index;
      delete rowData.$menu
      await editRole(rowData);
      this.$message({
        showClose: true,
        message: "修改成功",
        type: "success"
      });
      this.handleList();
      done();
    },
    changePage({ pageSize, currentPage }) {
      this.query.page = currentPage;
      this.query.limit = pageSize;
      this.handleList();
    }
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 8px 10px;
}
</style>
