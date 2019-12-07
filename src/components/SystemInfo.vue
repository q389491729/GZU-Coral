<template>
  <div class="systeminfo">
    <el-button type="primary" size="small" @click="handleClick">审批信息</el-button>
    <el-dialog
      :title="title"
      :visible.sync="isShow"
      width="50%"
      >
      <avue-form :value="list" :option="option"></avue-form>
    </el-dialog>
  </div>
</template>

<script>
import {getOne} from '@/api/checkplans';
export default {
  props:{
    data:{
      type: String,
      default: ''
    },
  },
  data(){
    return {
      isShow: false,
      option: {
        menuBtn: false,
        emptyBtn: false,
        column:[
          {
            label: '审批人',
            prop: 'checkman',
            disabled: true,
            span: 24
          },
          {
            label: '审批时间',
            prop: 'createdAt',
            type: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            span:24,
            disabled: true,
          },
          {
            label: '审批意见',
            prop: 'advice',
            span:24,
            type: 'textarea',
            disabled: true,
          },
          {
            label: '说明',
            prop: 'remark',
            span:24,
            type: 'textarea',
            disabled: true,
          }
        ]
      },
      title:'',
      list:{}
    }
  },
  methods:{
    async handleClick(){
      if( this.data !== '' ){
        let {data:{data}} = await getOne(this.data)
        if(data.length === 0 ){
          this.$message.error('该需求计划还未审批')
          return
        }
        this.list = data[0]
        this.isShow = !this.isShow
      } else {
        this.$message.error('请在左侧选择一个需求计划')
      }
    }
  }
}
</script>

<style>
.systeminfo{
  display: inline-block;
  margin: 0;
}
</style>