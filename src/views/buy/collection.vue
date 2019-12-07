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
          <avue-crud
            :data="tableData"
            :option="tableOption"
            v-model="tableForm"
            @row-click="handleRowClick"
            @row-update="update"
            ref="crud"
          >
            <template slot="menuLeft">
              <el-button type="primary" @click="createPlan" size="small">生成采购计划</el-button>
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
  createLog
} from "@/api/buy";
export default {
  data() {
    return {
      obj: {},
      needForm: {},
      treeData: [],
      tableForm: {},
      tableData: [],
      buyForm: [],
      selectData: []
    };
  },
  methods: {
    nodeClick(data) {
      this.selectData = data;
      if (data.goodsneed) {
        this.tableData = data.goodsneed;
      }
    },
    fetch() {
      getList().then(res => {
        let data = res.data;
        this.treeData = data;
        this.isSelect = false;
      });
    },
    handleRowClick(row, event, column) {
      this.$refs.crud.rowEdit(row, row.$index);
    },
    async update(row, index, done, loading) {
      if (row.buytype === "库存") {
        // 库存供应
        if (row.buynumber > row.count) {
          this.$message.error("供应数量不能大于需求数量");
          return loading();
        }
        if (row.buynumber > row.available) {
          this.$message.error("供应数量不能大于可用库存的数量");
          return loading();
        }
        await updatedStroe(row.storeid, {
          available: row.available - row.buynumber,
          occupy: parseInt(row.occupy) + parseInt(row.buynumber),
          total: row.total
        });
        if (row.count - row.buynumber) {
          // 没用供应完
          await updatedGoodsNeed(row._id, {
            count: row.count - row.buynumber
          });
        } else {
          await updatedGoodsNeed(row._id, {
            isBuying: true
          });
        }
        this.fetch();
        this.$message.success("操作成功");
        done();
      } else {
        // 采购
        this.tableData[row.$index].buytype = "采购";
        (this.tableData[row.$index].buynumber = row.buynumber),
          (this.tableData[row.$index].buyearly = row.buyearly);
        this.tableData[row.$index].buydate = row.buydate;
        this.$message.success("操作成功");
        done();
      }
    },
    async createPlan() {
      let data = this.tableData;
      if (!data.length) {
        return this.$message.error("请选中左侧的一行数据");
      }
      data = data.filter(e => e.buytype === "采购");
      if (!data.length) {
        return this.$message.error("未配置任何一个采购方案");
      }
      // 先创建采购计划
      let type = data[0].plantype;
      let title =
        type === "年度计划"
          ? data[0].date.substring(0, 4) + "年采购计划"
          : data[0].date.substring(0, 7) + "月采购计划";
      let plan = {
        title,
        checkstatus: "待提交",
        type,
        goodsbuy: []
      };
      for (let i = 0; i < data.length; i++) {
        let result = await createdGoodsBuy({
          goodsneed: data[i]._id,
          buydate: data[i].buydate,
          from: "物资需求",
          early: parseInt(data[i].buyearly),
          buynumber: data[i].buynumber
        });
        plan.goodsbuy.push(result.data._id);
      }
      let result = await createdBuyPlan(plan);
      await createLog({
        buy: result.data._id,
        updateduser: this.$store.state.user.userInfo.username,
        reason: "创建采购计划"
      });
      for (let i = 0; i < data.length; i++) {
        await updatedGoodsNeed(data[i]._id, {
          isBuying: true
        });
      }
      this.$message.success("操作成功");
      this.fetch();
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
          },
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
          },
          {
            label: "供应方式",
            prop: "buytype"
          },
          {
            label: "供应数量",
            prop: "buynumber"
          },
          {
            label: "采购提前期",
            prop: "buyearly"
          },
          {
            label: "采购日期",
            prop: "buydate"
          },
          {
            label: "备注",
            prop: "remark"
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
              },
              ...this.buyForm
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
  watch: {
    "tableForm.buytype": {
      handler(n, o) {
        if (n === "库存") {
          this.buyForm = [];
        } else {
          this.buyForm = [
            {
              label: "采购提前期",
              prop: "buyearly"
            },
            {
              label: "采购日期",
              prop: "buydate",
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd"
            }
          ];
        }
      },
      deep: true
    }
  }
};
</script>