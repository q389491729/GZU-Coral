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
          ></avue-tree>
        </el-col>
        <el-col :md="20" :xs="24" :sm="20">
          <avue-crud :data="tableData" :option="tableOption" v-model="tableForm" ref="crud">
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
  getList,
  updatedStroe,
  updatedGoodsNeed,
  createdBuyPlan,
  createdGoodsBuy,
  getAll,
  createLog,
  updateOne
} from "@/api/buy";

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
      buyForm: [],
      selectData: [],
      info: "",
      isSelect: false
    };
  },
  methods: {
    nodeClick(data) {
      this.selectData = data;
      this.info = data._id;
      this.isSelect = true;
      if (data.goodsbuy) {
        this.tableData = data.goodsbuy;
      }
    },
    fetch() {
      getAll('{"where":{"type":"月度计划"}}').then(res => {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].goodsbuy.length; j++) {
            let obj = Object.assign(
              data[i].goodsbuy[j],
              data[i].goodsbuy[j].goodsneed
            );
            data[i].goodsbuy[j] = obj;
          }
        }
        this.treeData = data;
      });
    },
    tijiao() {
      if (this.isSelect) {
        if (this.selectData.checkstatus === "待审批") {
          this.$message.error("该计划已提交审批，请重新选择。");
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
        addBtn: false,
        menu: false,
        stripe: true,
        column: [
          {
            label: "物料分类",
            prop: "type",
            disabled: true
          },
          {
            label: "物料名称",
            prop: "title",
            disabled: true
          },
          {
            label: "规格",
            prop: "size",
            disabled: true
          },
          {
            label: "型号",
            prop: "srcsize",
            disabled: true
          },

          {
            label: "单位",
            prop: "unit",
            disabled: true
          },
          {
            label: "固定供应商",
            prop: "ownsupplier",
            disabled: true
          },
          {
            label: "期望供应商",
            prop: "hopesupplier",
            disabled: true
          },
          {
            label: "所属需求部门",
            prop: "department",
            disabled: true
          },
          {
            label: "需求日期",
            prop: "date",
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label: "采购数量",
            prop: "buynumber",
            disabled: true
          },
          {
            label: "采购提前期",
            prop: "early"
          },
          {
            label: "采购日期",
            prop: "buydate",
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label: "计划来源",
            prop: "from"
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
                disabled: true
              },
              {
                label: "物料名称",
                prop: "title",
                disabled: true
              },
              {
                label: "规格",
                prop: "size",
                disabled: true
              },
              {
                label: "型号",
                prop: "srcsize",
                disabled: true
              },
              {
                label: "需求数量",
                prop: "count",
                disabled: true
              },
              {
                label: "单位",
                prop: "unit",
                disabled: true
              },
              {
                label: "固定供应商",
                prop: "ownsupplier",
                disabled: true
              },
              {
                label: "期望供应商",
                prop: "hopesupplier",
                disabled: true
              },
              {
                label: "所属需求部门",
                prop: "department",
                disabled: true
              },
              {
                label: "需求日期",
                prop: "date",
                type: "date",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
                disabled: true
              }
            ]
          },
          {
            label: "库存信息",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "可用库存",
                prop: "available",
                disabled: true
              },
              {
                label: "已占库存",
                prop: "occupy",
                disabled: true
              },
              {
                label: "库存总量",
                prop: "total",
                disabled: true
              }
            ]
          },
          {
            label: "供货方案",
            column: [
              {
                label: "供应方式",
                prop: "buytype",
                type: "select",
                valueDefault: "库存",
                dicData: [
                  {
                    label: "库存",
                    value: "库存"
                  },
                  {
                    label: "采购",
                    value: "采购"
                  }
                ]
              },
              {
                label: "供应数量",
                prop: "buynumber"
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
        menu: false
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