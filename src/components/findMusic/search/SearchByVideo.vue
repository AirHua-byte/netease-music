<template>
  <div style="margin-bottom:75px;">
    <el-row :gutter='20'>
      <el-col
        :span='6'
        v-for="(item, index) in videoList" 
        :key="index"
        style="margin-top: 20px;position: relative;">
          <div
            style="background:rgba(128,128,128,0.2);color:white;width:95%;position:absolute;z-index:10;">
            <div style="float:right;margin-right:15px;">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{item.playTime >= 10000 ? (item.playTime / 10000).toFixed(0)+ '万' : item.playTime}}
            </div>
          </div>

          <div style="padding-bottom: 56%;width: 100%;position: relative;">
            <el-image 
              :src='item.coverUrl'
              @click="toVideoPage(item.vid)"
              style="box-shadow: 0 0 2px 2px gray;border-radius:10px;cursor:pointer;width: 100%;height: 100%;position: absolute;top: 0;left: 0;  ">
            </el-image>
          </div>

          <h1 @click="toVideoPage(item.vid)" style="cursor:pointer;">{{item.title}}</h1>
        </el-col>
    </el-row>

    <el-pagination
      style="display:block; width:20%;margin:15px auto"
      layout="prev,pager,next"
      :page-size='queryInfo.limit'
      :total='videoTotal'
      @current-change='handleCurrentChange'
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      queryInfo: {
        keywords: this.$route.params.data,
        limit: 32,
        offset: 0,
        type: 1014
      },
      videoTotal: 0,
      videoList: []
    }
  },
  created() {
    this.getVideoResult()
  },
  methods: {
    getVideoResult() {
      this.$http.get('/cloudsearch',{params:this.queryInfo}).then(res => {
        this.videoList = res.data.result.videos
        this.videoTotal = res.data.result.videoCount
      })
    },
    toVideoPage(id){
      if(id.match(/\D/)!=null){
        this.$router.push('/videoPlay/' + id)
      }else{
        this.$router.push('/toVideoPage/' + id)
      }
    },
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      if(this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
      this.getVideoResult()
    }
  }
}
</script>

<style lang="less" scoped>
h1{
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>