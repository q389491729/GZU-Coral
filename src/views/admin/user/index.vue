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
        @on-load="changePage"
      >
        <template slot-scope="scope" slot="status">
          <el-tag :type="scope.row.status==true?'success':'danger'">{{scope.row.status? '有效':'无效'}}</el-tag>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getUserData,addUser,editUser,delUser } from "@/api/admin";
import { userOption } from "@/const/admin/adminTabelOption.js";
export default {
  name: "user",
  components: {},
  data() {
    return {
      tableOption: userOption, //表格设置属性
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
      }
    };
  },
  created() {
    this.handleList();
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters(["permission"])
  },
  props: [],
  methods: {
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList() {
      this.tableLoading = true;
      getUserData(this.query).then(res => {
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
     *  TODO: 用户增加功能
     **/
    async handleSave(row, done) {
      this.tableData.push(row);
      let rowData = JSON.parse(JSON.stringify(row))
      delete rowData.$department
      delete rowData.$role
      delete rowData.$sex
      delete rowData.$status
      await addUser(rowData)
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
     *  TODO: 用户删除功能
     **/
    handleDel(row, index) {
      this.$confirm(`是否确认删除${row.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await delUser(row._id);
          this.handleList()
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        })
        .catch(() => {});
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     * TODO: 用户更新
     **/
    async handleUpdate(row, index, done) {
      let rowData = JSON.parse(JSON.stringify(row));
      delete rowData.$department
      delete rowData.$role
      delete rowData.$sex
      delete rowData.$status
      delete rowData.$index
      await editUser(rowData)
      this.handleList()
      this.$message({
        showClose: true,
        message: "修改成功",
        type: "success"
      });
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
