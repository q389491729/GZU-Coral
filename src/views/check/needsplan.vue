<template>
  <div>
    <basic-container>
      <avue-crud
      :data="data"
      :option="option"
      v-model="form"
      :loading="loading"
      @selection-change="selectionChange"
    >
      <template slot="menuRight" v-if="!isCheck">
        <el-button type="success" size="small" @click="check(1)">审核通过</el-button>
        <el-button type="danger" size="small" @click="check(0)">审核退回</el-button>
      </template>
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          @click="isCheck = !isCheck"
        >{{isCheck?'查看待审批':'查看已审批'}}</el-button>
        <el-button v-show="isCheck" type="primary" size="small" @click="huizong">汇总</el-button>
      </template>
    </avue-crud>
    <el-dialog title="审核" :visible.sync="isShow" width="50%">
      <avue-form v-model="reason" :option="passOption" @submit="submit"></avue-form>
    </el-dialog>
    </basic-container>
  </div>
</template>


<script>
import { getAllByQuery, updateOne, createLog } from "@/api/plans";
import { createOne } from "@/api/checkplans";

export default {
  name: "needsplan",
  data() {
    return {
      isShow: false,
      data: [],
      reason: {},
      form: {},
      selectData: [],
      isCheck: false,
      option: {
        title: "需求计划审批",
        loading: false,
        align: "center",
        menuAlign: "center",
        index: true,
        indexLabel: "序号",
        printBtn: true,
        excelBtn: true,
        addBtn: false,
        menu: false,
        selection: true,
        column: [
          {
            label: "计划名称",
            prop: "title"
          },
          {
            label: "计划类型",
            prop: "type"
          },
          {
            label: "审批状态",
            prop: "checkstatus"
          },
          {
            label: "部门",
            prop: "department"
          },
          {
            label: "需求人员",
            prop: "needsman"
          },
          {
            label: "创建日期",
            prop: "createdAt",
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label: "备注",
            prop: "remark"
          }
        ]
        // group: [
        //   {
        //     column: [
        //       {
        //         label: "角色名称",
        //         prop: "name",
        //         type: "input"
        //       },
        //       {
        //         label: "角色描述",
        //         prop: "description",
        //         type: "input"
        //       }
        //     ]
        //   }
        // ]
      },
      passOption: {
        column: [
          {
            label: "审批意见",
            prop: "reason",
            span: 24,
            type: "textarea",
            rules: [
              {
                required: true,
                message: "请输入审批意见",
                trigger: "blur"
              }
            ]
          },
          {
            label: "备注",
            prop: "remark",
            span: 24,
            type: "textarea"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    huizong(){
      if (!this.selectData.length) {
        return this.$message.error("请至少选择一个需求计划");
      } 
      let list = JSON.parse(JSON.stringify(this.selectData));
      if(list.some(e => e.checkstatus === '审批退回' )){
        return this.$message.error("不能汇总审批退回的计划")
      }
      list.forEach(async el => {
        await updateOne(el._id,{iscollect: true})
        await createLog({
          needsplan_id: el._id,
          updateduser: this.$store.state.user.userInfo.username,
          reason: '提交汇总'
        });
      })
      this.fetch();
      this.$message.success("操作成功");
      location.reload();
      done()
    },
    async fetch() {
      this.loading = true;
      let data;
      if (this.isCheck) {
        // 审批退回和审批通过的
        let result = await getAllByQuery(
          `{"where":{"$and":[{"checkstatus":{"$in":["审批通过","审批退回"]}},{"iscollect": "false"}]}}`
        );
        data = result.data.data;
      } else {
        let result = await getAllByQuery(`{"where":{"checkstatus":"待审批"}}`);
        data = result.data.data;
      }
      this.data = data;
      this.loading = false;
    },
    check(flag) {
      if (!this.selectData.length) {
        return this.$message.error("请至少选择一个需求计划");
      }
      this.isShow = true;
      if (flag) {
        // pass
        this.type = "pass";
      } else {
        // refause
        this.type = "refause";
      }
    },
    selectionChange(list) {
      this.selectData = list;
    },
    async submit(form, done) {
      // 提交
      this.$message.success("加载中，请稍等");
      let type = this.type === "pass" ? "审批通过" : "审批退回";
      let list = JSON.parse(JSON.stringify(this.selectData));
      for(let i = 0; i<list.length;i ++){
        let obj = {
          checkman: this.$store.state.user.userInfo.username,
          advice: form.reason,
          remark: form.remark,
          needsplan: list[i]._id
        };
        await createOne(obj);
        let result = await updateOne(list[i]._id, { checkstatus: type });
        await createLog({
          needsplan_id: result.data._id,
          updateduser: this.$store.state.user.userInfo.username,
          reason: type
        });
      }
      // list.forEach(async el => {
      //   let obj = {
      //     checkman: this.$store.state.user.username,
      //     advice: form.reason,
      //     remark: form.remark,
      //     needsplan: el._id
      //   };
      //   await createOne(obj);
      //   let result = await updateOne(el._id, { checkstatus: type });
      //   await createLog({
      //     needsplan_id: result.data._id,
      //     updateduser: this.$store.state.user.username,
      //     reason: type
      //   });
      // });
      this.fetch();
      this.$message.success("操作成功");
      location.reload();
      done();
      this.isShow = false;
    }
  },
  mounted() {
    this.fetch();
  },
  watch: {
    isCheck() {
      this.fetch();
    }
  }
};
</script>