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
          <avue-crud :data="tableData" :option="tableOption" v-model="tableForm"></avue-crud>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { getCollection } from "@/api/plans";
export default {
  data() {
    return {
      obj: {},
      needForm: {},
      treeData: [],
      tableForm: {},
      tableData: []
    };
  },
  methods: {
    nodeClick(data) {
      this.tableData = data.goodsneed;
    },
    fetch() {
      getCollection().then(res => {
        let data = res.data;
        this.treeData = data;
        this.isSelect = false;
      });
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
            label: "固定供应商",
            prop: "ownsupplier"
          },
          {
            label: "期望供应商",
            prop: "hopesupplier"
          },
          {
            label: "所属需求部门",
            prop: "department"
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
            prop: "remark"
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
  }
};
</script>