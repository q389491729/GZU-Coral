<template>
  <div>
    <basic-container>
      <el-row :gutter="20" :span="24">
        <el-col :md="4" :xs="24" :sm="4">
          <avue-tree
            ref="tree"
            :option="treeOption"
            :data="treeData"
            @node-click="nodeClick"
            v-model="needForm"
            @save="save"
            @update="update"
            @del="del"
          >
            <template slot-scope="scope" slot="menuBtn">
              <el-dropdown-item @click.native="treeView(scope.node,scope.data)">查看</el-dropdown-item>
              <el-dropdown-item @click.native="treeEdit(scope.node,scope.data)">修改</el-dropdown-item>
              <el-dropdown-item @click.native="treeDel(scope.node,scope.data)">删除</el-dropdown-item>
            </template>
            <template slot-scope="scope" slot="addBtn">
              <el-button
                @click.native="treeAdd(scope.node,scope.data)"
                type="primary"
                icon="el-icon-plus"
              ></el-button>
            </template>
          </avue-tree>
        </el-col>
        <el-col :md="20" :xs="24" :sm="20">
          <avue-crud
            :data="tableData"
            :option="tableOption"
            v-model="tableForm"
            @row-save="tableSave"
            @row-update="tableUpdate"
            @row-del="tableDel"
            :before-open="tableOpen"
          >
            <template slot="menuLeft">
              <el-button type="primary" @click="tijiao" size="small">提交审批</el-button>
              <system-info :data="info"></system-info>
              <log :data="info"></log>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import {
  getAllPlans,
  saveGoodsNeed,
  getGoodsSelect,
  getOnePlan,
  updateOne,
  updateGoodsNeed,
  deleteGoodsNeed,
  createdOne,
  deleteOne,
  createLog
} from "@/api/plans";
import SystemInfo from "@/components/SystemInfo";
import Log from "@/components/Log";

export default {
  data() {
    return {
      obj: {},
      needForm: {},
      treeData: [],
      tableForm: {},
      tableData: [],
      selectData: {},
      selectTreeIndex: 0,
      title: "",
      dic: {},
      isSelect: false,
      submitText: "增加",
      disabled: false,
      submitBtn: true,
      newObj: "",
      info: "",
      reasonForm: []
    };
  },
  methods: {
    tijiao() {
      if (this.isSelect) {
        if (this.selectData.checkstatus === "待审批") {
          this.$message.error("该计划已提交审批，请重新选择。");
          return;
        }
        if (this.selectData.goodsneed.length === 0) {
          this.$message.error("物资需求不能为空，请添加后再试");
          return;
        }
        this.$confirm("是否提交审批?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(async () => {
            await updateOne(this.info, { checkstatus: "待审批" });
            await createLog({
              needsplan_id: this.info,
              updateduser: this.$store.state.user.userInfo.username,
              reason: "提交审批"
            });
            this.$message.success("提交成功");
            this.fetch();
          })
          .catch(() => {});
      } else {
        this.$message.error("请选中需求计划后进行操作");
      }
    },
    treeEdit(node, data) {
      if (this.isSelect) {
        this.reasonForm = [];
        this.reasonForm.push({
          label: "修改原因",
          span: 24,
          prop: "reason",
          type: "textarea",
          rules: [
            {
              required: true,
              message: "请输入修改原因名称",
              trigger: "blur"
            }
          ]
        });
        this.$refs["tree"].type = "edit";
        this.$refs["tree"].node = node;
        this.$refs["tree"].obj = data;
        this.$refs["tree"].form = JSON.parse(
          JSON.stringify(this.$refs["tree"].obj)
        );
        this.disabled = false;
        this.submitBtn = true;
        this.submitText = "编辑";
        this.$refs["tree"].show();
      } else {
        this.$message.error("请选中需求计划后进行操作");
      }
    },
    treeAdd(node, data) {
      this.reasonForm = [];
      this.disabled = false;
      this.$refs["tree"].type = "add";
      this.submitText = "新增";
      this.submitBtn = true;
      this.$refs["tree"].show();
    },
    treeDel(node, data) {
      if (this.isSelect) {
        this.$confirm("是否删除改节点?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            await deleteOne(data._id);
            this.$message.success("删除成功");
            this.fetch();
          })
          .catch(() => {});
      } else {
        this.$message.error("请选中需求计划后进行操作");
      }
    },
    treeView(node, data) {
      if (this.isSelect) {
        this.$refs["tree"].type = "view";
        this.reasonForm = [];
        this.submitText = "查看";
        this.$refs["tree"].node = node;
        this.$refs["tree"].obj = data;
        this.$refs["tree"].form = JSON.parse(
          JSON.stringify(this.$refs["tree"].obj)
        );
        this.disabled = true;
        this.submitBtn = false;
        this.$refs["tree"].show();
      } else {
        this.$message.error("请选中需求计划后进行操作");
      }
    },
    del(data, node, done, loading) {
      done();
    },
    async update(data, node, done, loading) {
      let obj = JSON.parse(JSON.stringify(this.needForm));
      delete obj.$budgetplan;
      let newPlan = await updateOne(obj._id, obj);
      await createLog({
        needsplan_id: newPlan.data._id,
        updateduser: this.$store.state.user.userInfo.username,
        reason: obj.reason
      });
      this.fetch();
      done();
    },
    async save(data, node, done) {
      let obj = JSON.parse(JSON.stringify(this.needForm));
      delete obj.$budgetplan;
      delete obj.$department;
      obj.needsman = this.$store.state.user.userInfo.username;
      let newPlan = await createdOne(obj);
      let logObj = {
        needsplan_id: newPlan.data._id,
        updateduser: this.$store.state.user.userInfo.username,
        reason: "创建需求计划"
      };
      await createLog(logObj);
      this.fetch();
      done();
    },
    nodeClick(data) {
      if (data.children) {
        this.isSelect = false;
      } else {
        this.isSelect = true;
        this.selectData = data;
        this.tableData = data.goodsneed;
        this.info = data._id;
      }
    },
    fetch() {
      getAllPlans("月度计划").then(res => {
        let data = res.data.data;
        this.treeData = data;
        let tableData = [];
        if (data[this.selectTreeIndex]) {
          tableData = data[this.selectTreeIndex].children[0].goodsneed;
        }
        delete tableData.$index;
        this.tableData = tableData;
        this.isSelect = false;
      });
    },
    async tableSave(row, done, loading) {
      let goods = {
        size: row.size,
        title: row.title,
        srcsize: row.srcsize,
        unit: row.unit,
        ownsupplier: row.ownsupplier,
        type: row.type,
        count: row.count,
        remark: row.remark,
        hopesupplier: row.hopesupplier,
        department: this.selectData.department,
        date: row.date,
        plantype: "月度计划"
      };
      let {
        data: { _id }
      } = await saveGoodsNeed(goods);
      let result = await getOnePlan(this.selectData._id);
      result.data.goodsneed.push(_id);
      await updateOne(this.selectData._id, {
        goodsneed: result.data.goodsneed
      });
      this.$message.success("添加成功");
      this.fetch();
      done();
    },
    async tableUpdate(row, index, done, loading) {
      let data = JSON.parse(JSON.stringify(row));
      delete data.$index;
      delete data.$type;
      delete data.$size;
      delete data.$srcsize;
      delete data.$hopesupplier;
      delete data.$title;
      delete data.$department;
      await updateGoodsNeed(data._id, data);
      this.$message.success("更新成功");
      this.fetch();
      done();
    },
    async tableDel(row, index) {
      await deleteGoodsNeed(row._id);
      this.$message.success("删除成功");
      this.fetch();
      done();
    },
    tableOpen(done, type) {
      if (this.isSelect) {
        done();
      } else {
        this.$message.error("请在左侧选中一个需求计划");
      }
    }
  },
  computed: {
    tableOption() {
      return {
        page: false,
        align: "center",
        menuAlign: "center",
        excelBtn: "true",
        index: "true",
        indexLabel: "序号",
        printBtn: true,
        viewBtn: true,
        saveBtnTitle: "新增",
        stripe: true,
        column: [
          {
            label: "物料分类",
            prop: "type"
          },
          {
            label: "物料名称",
            prop: "title"
          },
          {
            label: "规格",
            prop: "size"
          },
          {
            label: "型号",
            prop: "srcsize"
          },
          {
            label: "需求数量",
            prop: "count"
          },
          {
            label: "单位",
            prop: "unit"
          },
          {
            label: "供应商",
            prop: "ownsupplier"
          },
          {
            label: "需求日期",
            prop: "date",
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label: "备注",
            prop: "remark",
            hide: true
          }
        ],
        group: [
          {
            label: "物料信息",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "物料分类",
                prop: "type",
                type: "select",
                props: {
                  label: "title",
                  value: "title"
                },
                dicUrl: `/goodstypes`,
                cascaderItem: ["title"],
                cascaderChange: true,
                rules: [
                  {
                    required: true,
                    message: "请选择物料分类",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "物料名称",
                prop: "title",
                props: {
                  label: "title",
                  value: "title"
                },
                type: "select",
                dicUrl: `/goods?query={"where":{"type":"{{key}}"}}`,
                rules: [
                  {
                    required: true,
                    message: "请选择物料名称",
                    trigger: "blur"
                  }
                ],
                change: ({ value, column }) => {
                  if (value) {
                    this.title = value;
                    getGoodsSelect(value).then(res => {
                      this.dic = res.data.data;
                      this.tableForm.unit = res.data.data.unit;
                      this.tableForm.ownsupplier = res.data.data.ownsupplier;
                    });
                  }
                }
              },
              {
                label: "规格",
                prop: "size",
                type: "select",
                props: {
                  label: "title",
                  value: "title"
                },
                dicData: this.dic.size,
                rules: [
                  {
                    required: true,
                    message: "请选择规格",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "型号",
                prop: "srcsize",
                type: "select",
                props: {
                  label: "title",
                  value: "title"
                },
                dicData: this.dic.srcsize,
                rules: [
                  {
                    required: true,
                    message: "请选择型号",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "单位",
                prop: "unit",
                type: "input",
                readonly: true,
                rules: [
                  {
                    required: true,
                    message: "请选择单位",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "固定供应商",
                prop: "ownsupplier",
                labelWidth: "100",
                type: "input",
                readonly: true,
                rules: [
                  {
                    required: true,
                    message: "请选择固定供应商",
                    trigger: "blur"
                  }
                ]
              }
            ]
          },
          {
            label: "物料需求",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "需求数量",
                prop: "count",
                type: "number",
                rules: [
                  {
                    required: true,
                    message: "请输入需求数量",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "期望供应商",
                prop: "hopesupplier",
                labelWidth: "100",
                type: "select",
                props: {
                  label: "title",
                  value: "title"
                },
                dicData: this.dic.supplier,
                rules: [
                  {
                    required: true,
                    message: "请选择期望供应商",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "需求日期",
                prop: "date",
                type: "date",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
                rules: [
                  {
                    required: true,
                    message: "请选择需求日期",
                    trigger: "change",
                    pattern: /.+/
                  }
                ]
              },
              {
                label: "备注",
                prop: "remark",
                type: "textarea",
                span: 24
              }
            ]
          }
        ]
      };
    },
    treeOption() {
      return {
        nodeKey: "_id",
        size: "small",
        props: {
          label: "title",
          value: "title",
          children: "children"
        },
        addBtn: false,
        editBtn: false,
        delBtn: false,
        formOption: this.formOption
      };
    },
    formOption() {
      return {
        submitText: this.submitText,
        emptyBtn: false,
        submitBtn: this.submitBtn,
        column: [
          {
            label: "计划名称",
            prop: "title",
            disabled: this.disabled,
            rules: [
              {
                required: true,
                message: "请输入计划名称",
                trigger: "blur"
              }
            ]
          },
          {
            hide: true,
            label: "计划类型",
            prop: "type",
            disabled: this.disabled,
            readonly: true,
            valueDefault: "月度计划"
          },
          {
            label: "计划状态",
            prop: "status",
            disabled: this.disabled,
            readonly: true,
            valueDefault: "自由"
          },
          {
            label: "审批状态",
            prop: "checkstatus",
            disabled: this.disabled,
            readonly: true,
            valueDefault: "待提交"
          },
          {
            label: "需求部门",
            prop: "department",
            dicUrl: `/departments`,
            props: {
              label: "name",
              value: "name"
            },
            type: "select",
            span: 12,
            disabled: this.disabled,
            rules: [
              {
                required: true,
                message: "请选择需求部门",
                trigger: "blur"
              }
            ]
          },
          {
            label: "预算内计划",
            prop: "budgetplan",
            disabled: this.disabled,
            labelWidth: "100",
            type: "radio",
            dicData: [
              { label: "是", value: true },
              { label: "否", value: false }
            ],
            valueDefault: false
          },
          {
            label: "需求年份",
            prop: "year",
            type: "year",
            format: "yyyy年",
            valueFormat: "yyyy年",
            rules: [
              {
                required: true,
                message: "请选择需求年份",
                trigger: "change",
                pattern: /.+/
              }
            ],
            disabled: this.disabled
          },
          {
            label: "需求月份",
            prop: "month",
            type: "month",
            format: "M月",
            valueFormat: "M月",
            rules: [
              {
                required: true,
                message: "请选择需求月份",
                trigger: "change",
                pattern: /.+/
              }
            ],
            disabled: this.disabled
          },
          ...this.reasonForm,

          {
            label: "备注",
            span: 24,
            prop: "remark",
            type: "textarea",
            disabled: this.disabled
          }
        ]
      };
    }
  },
  mounted() {
    this.fetch();
  },
  components: {
    SystemInfo,
    Log
  }
};
</script>