<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div class="avue-breadcrumb">
        <i
          class="icon-navicon avue-breadcrumb_collapse"
          :class="[{ 'avue-breadcrumb_collapse--right': isCollapse }]"
          @click="setCollapse"
        ></i>
      </div>
    </div>
    <h1 class="top-bar__title">
      <div class="top-bar__item top-bar__item--show">
        <top-menu></top-menu>
      </div>
    </h1>
    <div class="top-bar__right">
      <el-tooltip
        effect="dark"
        :content="logsFlag?'没有错误日志':`${logsLen}条错误日志`"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="锁屏" placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="特色主题" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="用户头像" placement="bottom">
        <img class="top-bar__img" :src="userInfo.avatar" />
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">个人信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { resetRouter } from "@/router/router";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topBreadcrumb from "./top-breadcrumb";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
export default {
  components: { topLock, topMenu, topBreadcrumb, topTheme, topLogs },
  name: "top",
  data() {
    return {};
  },
  filters: {},
  created() {},
  mounted() {
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showCollapse: state => state.common.showCollapse,
      showMenu: state => state.common.showMenu
    }),
    ...mapGetters([
      "userInfo",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag"
    ])
  },
  methods: {
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          resetRouter();
          this.$router.push({ path: "/login" });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

