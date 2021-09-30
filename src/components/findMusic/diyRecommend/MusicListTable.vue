<template>
  <el-table
    :data='currentMusicListInfo'
    ref='playTable'
    highlight-current-row
    stripe
    style='cursor:context-menu'
    @row-dblclick='playMusicList'
  >
    <el-table-column label="#" type="index">
      <template scope="scope">
        <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
        <p v-else>{{scope.$index+1}}</p>
      </template>
    </el-table-column>

    <el-table-column v-if="false" label="id" prop="id"></el-table-column>

    <el-table-column label="音乐标题" prop="name"></el-table-column>

    <el-table-column label="歌手" prop="ar[0].name">
      <template scope="scope">
        <span 
          v-for="(item,index) in scope.row.ar" 
          :key='index'
          style="cursor:pointer"
          @click="toSingerPage(item.id)"  
        >
          {{
            scope.row.ar.length > 1 && index !== scope.row.ar.length-1 ? item.name +'/' : item.name
          }}
        </span>
      </template>
    </el-table-column>

    <el-table-column label="专辑名" prop="al.name"></el-table-column>
    <el-table-column label="时长" prop="dt"></el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      queryIds: this.$route.params.ids ? this.$route.params.ids : window.localStorage.getItem('queryIds'),
      currentMusicListInfo: [],
      songListInfo: [],
      curId: parseInt(window.localStorage.getItem('curPlayMusicId'))
    }
  },
  created() {
    this.handlerSongList()
    window.addEventListener('setItem',()=>{
      this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
    })
  },
  mounted(){
    window.localStorage.setItem('queryIds',this.queryIds)
  },
  methods: {
    handlerSongList() {
      this.$http('song/detail',{params:{ids:this.queryIds}}).then(res=>{
        this.currentMusicListInfo = res.data.songs
        this.currentMusicListInfo.forEach(item=>{
          const dt = new Date(item.dt)
          const mm = (dt.getMinutes() + '').padStart(2,'0')
          const ss = (dt.getSeconds() + '').padStart(2,'0')

          item.dt = mm + ':' + ss
        })
        this.setSongListInfo()
      })
    },
    playMusicList(row){
      this.$emit('setSongListInfo',this.songListInfo,row.id)
    },
    setSongListInfo(){
      this.currentMusicListInfo.forEach(item=>{
        this.songListInfo.push(item.id)
      })
    },
    toSingerPage(id){
      this.$router.push('/singer/' + id)
    }
  }
}
</script>

<style lang="less" scoped>

</style>