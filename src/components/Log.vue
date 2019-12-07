<template>
  <div style="display:inline-block;">
    <el-button type="primary" size="small" @click="handleClick">系统信息</el-button>
    <el-dialog title="系统信息" :visible.sync="isShow" width="50%">
      <el-timeline>
        <el-timeline-item v-for="(item,index) in list" :key="index" :timestamp="item.createdAt | dateformat" placement="top">
          <el-card>
            <h4>{{item.reason}}</h4>
            <p><el-tag type="primary">{{item.updateduser}}</el-tag> 提交于 {{item.createdAt | dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getLog } from '@/api/plans'
export default {
  props: {
    data: {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      list: [],
      isShow: false
    }
  },
  methods: {
    async handleClick(){
      if( this.data !== '' ){
        let {data} = await getLog(this.data)
        this.list = data
        this.isShow = !this.isShow
      } else {
        this.$message.error('请在左侧选择一个需求计划')
      }
    }
  }
};
</script>

<style>
</style>