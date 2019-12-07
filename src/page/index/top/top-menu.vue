<template>
  <div class="top-menu">
    <el-menu :default-active="activeIndex"
             mode="horizontal"
             text-color="#333">
      <template v-for="(item,index) in items">
        <el-menu-item :index="(item.parentId+1)+''"
                      @click.native="openMenu(item,index)"
                      :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.label}}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "top-menu",
  inject: ["index"],
  data () {
    return {
      activeIndex: "2",
      items: []
    };
  },
  created () {
    this.getMenu();
  },
  computed: {
    ...mapGetters(["tagCurrent", "menu"])
  },
  methods: {
    openMenu (item) {
      this.index.openMenu(item)
    },
    getMenu () {
      this.$store.dispatch("GetTopMenu").then(res => {
        let result = JSON.parse(JSON.stringify(res))
        for(let i = 0; i < result.length; i ++){
          result[i].parentId = i + 1;
          let path = this.$route.path
          if(!path.indexOf(result[i].path.substr(0,4))) this.activeIndex = i+2+'';
        }
        this.items = result;
      });
    },
  }
};
</script>