<template>
  <div>
    <basic-container>
      <avue-data-box :option="easyDataOption"></avue-data-box>
      <!-- <avue-data-icons :option="easyDataOption2"></avue-data-icons> -->
    </basic-container>
    <!-- <el-row :span="24">
      <el-col :md="24" :xs="24" :sm="24">
        <basic-container>
          <avue-data-icons :option="easyDataOption2"></avue-data-icons>
        </basic-container>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
export default {
  name: "wel",
  data() {
    return {
      easyDataOption: {
        data: [
          {
            title: "错误日志",
            count: 12332,
            icon: "icon-cuowu",
            color: "rgb(49, 180, 141)"
          },
          {
            title: "数据展示",
            count: 33,
            icon: "icon-shujuzhanshi2",
            color: "rgb(56, 161, 242)"
          },
          {
            title: "权限管理",
            count: 2223,
            icon: "icon-jiaoseguanli",
            color: "rgb(117, 56, 199)"
          }
        ]
      },
      easyDataOption2: {
        span: 6,
        discount: true,
        data: [
          {
            title: "错误日志",
            icon: "icon-cuowu"
          },
          {
            title: "数据展示",
            icon: "icon-shujuzhanshi2"
          },
          {
            title: "权限管理",
            icon: "icon-jiaoseguanli"
          },
          {
            title: "菜单管理",
            icon: "icon-caidanguanli"
          }
        ]
      }
    };
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.data-icons .item {
  margin: 0;
}
.wel-info {
  padding: 26px 0;
  .img-border {
    width: 64px;
    height: 65px;
    position: relative;
    vertical-align: middle;
    display: inline-block;
  }
  .img-v {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 22px;
    height: 22px;
  }
  .img {
    border-radius: 5px;
    width: 64px;
    height: 64px;
    display: inline-block;
    overflow: hidden;
    img {
      display: block;
      max-width: none;
      height: 64px;
      opacity: 1;
      width: 64px;
      margin-left: 0px;
      margin-top: 0px;
    }
  }
  .user {
    margin-left: 20px;
    display: inline-block;
    color: rgb(153, 153, 153);
    vertical-align: middle;
  }
  .user-title {
    font-size: 18px;
    color: rgb(102, 102, 102);
    margin-right: 5px;
    display: inline-block;
    max-width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .user-subtitle {
    display: inline-block;
    width: 40px;
    height: 16px;
    line-height: 16px;
    border-radius: 2px;
    padding: 0px 5px;
    margin-left: 10px;
    font-size: 12px;
    text-align: center;
    color: rgb(255, 44, 84);
    background-color: rgb(255, 242, 244);
    white-space: nowrap;
  }
  .user-item {
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
