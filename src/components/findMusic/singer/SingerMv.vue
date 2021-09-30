<template>
  <div style="margin-top:25px;margin-bottom:160px;">
    <el-row :gutter="30">
      <el-col
        :span='6'
        v-for="(item, index) in singerMvList" 
        :key="index"
        style="margin-top:20px;position:relative;">
          <div style="background:rgba(128,128,128,0.2);color:white;width:90%;position:absolute;z-index:10;">
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
            </div>
          </div>

          <!-- <div>
            <el-image
              :src='item.imgurl'
              @click='toMvPage(item.id)'
              style="box-shadow:0 0 2px 2px gray;border-radius:10px;cursor:pointer;width: 100%;height: 100%;"
            ></el-image>
          </div> -->

          <div style="padding-bottom: 65%;width: 100%;position: relative;">
            <el-image 
              :src='item.imgurl'
              @click="toMvPage(item.id)"
              style="box-shadow: 0 0 2px 2px gray;border-radius:10px;cursor:pointer;width: 100%;height: 100%;position: absolute;top: 0;left: 0;  ">
            </el-image>
          </div>
          <h1 @click="toMvPage(item.id)" style="cursor:pointer">{{item.name}}</h1>
      </el-col>
    </el-row>

    <el-pagination
      background
      :page-size='queryInfo.limit'
      layout='prev,next'
      @current-change='handleCurrentChange'
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      singerId: this.$route.params.id,
      queryInfo: {
        id: this.$route.params.id,
        limit: 12,
        offset: 0
      },
      singerMvList: []
    }
  },
  created(){
    this.getCurrentSingerMv()
  },
  methods: {
    getCurrentSingerMv(){
      this.$http.get('artist/mv',{params:this.queryInfo}).then(res=>{
        this.singerMvList = res.data.mvs
      })
    },
    handleCurrentChange(newPage){
      console.log(newPage)
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getCurrentSingerMv()
    },
    toMvPage(mvId){
      this.$router.push('/toVideoPage/'+mvId)
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