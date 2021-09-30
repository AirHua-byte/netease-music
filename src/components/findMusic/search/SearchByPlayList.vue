<template>
  <div style="margin-bottom:75px;">
    <el-row
      v-for="(item, index) in playList" :key="index"
      style="padding: 5px;">
      <el-col
        :span='18'
        :offset='3'
        @click.native="toPlayListPage(item.id)"
        :style="index % 2 === 0 ? 'background:rgb(245,245,247);cursor:pointer;' : 'cursor:pointer;'">
        <el-image
          :src='item.coverImgUrl'
          style="width:80px;height:80px;border-radius:5px">
        </el-image>
        <span style="position: absolute;top:40px;font-size:14px;margin-left:3%">{{item.name}}</span>
        <span style="position: absolute;top:40px;font-size:14px;margin-left:30%">{{item.trackCount}}首</span>
        <span style="position: absolute;top:40px;font-size:14px;margin-left:50%">by {{item.creator.nickname}}</span>
      </el-col>
    </el-row>
    
    <el-pagination 
      style="display: block;width: 20%;margin: 15px auto"
      layout="prev, pager, next" :page-size="queryInfo.limit"
      :total="playListTotal" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      queryInfo: {
        keywords: this.$route.params.data,
        limit: 12,
        offset: 0,
        type: 1000
      },
      playListTotal: 0,
      playList: []
    }
  },
  created() {
    this.getPlayListResult()
  },
  methods:{
    getPlayListResult(){
      this.$http.get('/cloudsearch',{params:this.queryInfo}).then(res => {
        this.playList = res.data.result.playlists
        this.playListTotal = res.data.result.playlistCount
      })
    },
    handleCurrentChange(newPage) {
        this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
        if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
        this.getPlayListResult();
    },
    toPlayListPage(id) {
        this.$router.push('/songlist/'+id)
    }
  }
}
</script>