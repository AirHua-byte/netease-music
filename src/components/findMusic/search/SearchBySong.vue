<template>
  <div style="margin-bottom:75px">
    <el-table 
    :data='songlist' 
    ref='playTable' 
    highlight-current-row 
    stripe
    style="cursor:context-menu;"
    @row-dblclick='playMusic'>
      <el-table-column label="序号" type="index" width="100px">
        <template scope="scope">
          <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
          <p v-else>{{scope.$index+1}}</p>
        </template>
      </el-table-column>

      <el-table-column v-if="false" label="id" prop="id"></el-table-column>

      <el-table-column label="音乐标题" prop="name"></el-table-column>

      <el-table-column label="歌手">
        <template scope="scope">
          <span 
          v-for="(item,index) in scope.row.artists" 
          :key="index" 
          style="cursor:pointer" 
          @click="toSingerPage(item.id)">
            {{
              scope.row.artists.length > 1 && index !== scope.row.artists.length-1 ? item.name + '/' : item.name
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="专辑名" prop="album.name"></el-table-column>

      <el-table-column label="时长" prop="duration"></el-table-column>
    </el-table>

    <el-pagination
      style="display:block; width:20%;margin:15px auto"
      layout="prev,pager,next"
      :page-size='queryInfo.limit'
      :total='songTotal'
      @current-change='handleCurrentChange'
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      queryInfo:{
        keywords: this.$route.params.data,
        limit:30,
        offset:0,
        type:1
      },
      songTotal: 0,
      songlist: [],
      curId: parseInt(window.localStorage.getItem('curPlayMusicId'))
    }
  },
  created(){
    this.getSearchResult()
    window.addEventListener('setItem',()=>{
      console.log('...')
      this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
    })
  },
  methods:{
    getSearchResult(){
      this.$http.get('/search',{params:this.queryInfo}).then(res=>{
        this.songlist = res.data.result.songs
        // console.log(this.songlist)
        this.songTotal = res.data.result.songCount
        this.songlist.forEach(item=>{
          var time = item.duration / 1000
          var minute = time / 60
          var minutes = parseInt(minute)
          if(minutes<10){
            minutes = '0' + minutes
          }
          var second = time % 60
          var seconds = Math.round(second)
          if(seconds<10){
            seconds = '0' + seconds
          }
          item.duration = `${minutes}:${seconds}`
        })
      })
    },
    playMusic(row){
      this.$http.get('song/url',{params:{id:row.id}}).then(res=>{
        if(res.data.data[0].url !== ''){
          this.$http.get('song/detail',{params:{ids:row.id}}).then(r=>{
            this.$emit('setMusicUrl',res.data.data[0].url,r.data.songs[0])
          })
        }
      })
    },
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1)* this.queryInfo.limit
      if(this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
      this.getSearchResult()
    },
    toSingerPage(id){
      this.$router.push('/singer/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
</style>