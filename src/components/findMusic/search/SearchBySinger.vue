<template>
  <div style="margin-bottom:75px">
    <el-row 
      v-for="(item,index) in singerList" 
      :key="index"
      style="padding: 5px;">
      <el-col 
        :span='18' 
        :offset="3" 
        @click.native="toSingerPage(item.id)"
        :style="index % 2 === 0 ? 'background:rgb(245,245,247);cursor:pointer;' : 'cursor:pointer;' ">
        <el-image 
          :src="item.picUrl"
          style="width:80px;height:80px;border-radius:5px"></el-image>
        <span style="position: absolute;top: 40%;margin-left:3%;font-size:14px;">{{item.name}}</span>
      </el-col>
    </el-row>

    <el-pagination
      style="display:block; width:20%;margin:15px auto"
      layout="prev,pager,next"
      :page-size='queryInfo.limit'
      :total="singerTotal"
      @current-change='handleCurrentChange'>
    </el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      queryInfo: {
        keywords: this.$route.params.data,
        limit: 30,
        offset: 0,
        type: 100
      },
      singerTotal: 0,
      singerList: []
    }
  },
  created() {
    this.getSingerResult()
  },
  methods: {
    getSingerResult(){
      this.$http.get('/cloudsearch',{params:this.queryInfo}).then(res=>{
        this.singerList = res.data.result.artists
        this.singerTotal = res.data.result.artistCount
      })
    },
    toSingerPage(id){
      this.$router.push('/singer/' + id)
    },
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
      this.getSingerResult();
    }
  }
}
</script>