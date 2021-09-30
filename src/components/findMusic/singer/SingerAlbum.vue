<template>
  <div style="margin-top:50px;margin-bottom:75px;">
    <el-row>
      <el-col :span='4' :offset="2">
        <el-image src='imgs/top50.png' style="width:150px;height:150px;border-radius:8px;"></el-image>
      </el-col>

      <el-col :span='14'>
        热门50曲
        <el-table
          :data='hot50Songs.slice(0,defaultShow)'
          highlight-current-row
          stripe
          :show-header="false"
          @row-dblclick='playHot50Music'
        >
          <el-table-column label='#' type='index'>
            <template scope="scope">
              <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
              <p v-else>{{scope.$index+1 >= 10 ? scope.$index+1 : '0' + (scope.$index+1)}}</p>
            </template>
          </el-table-column>
          <el-table-column label='操作' width='70px'>
            <template>
              <i class="el-icon-star-off" style="font-size:18px;cursor:pointer"></i>
              <i class="el-icon-download" style="margin-left:10px;font-size:18px;cursor:pointer"></i>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="id" prop="id"></el-table-column>
          <el-table-column label="音乐标题" prop="name"></el-table-column>
          <el-table-column label="时长" prop="dt" width="80px;"></el-table-column>
        </el-table>
        <p class="show" style="margin-top:15px;cursor:pointer;" @click="changeDefaultNum">查看全部50首</p>
      </el-col>
    </el-row>

    <el-row v-for="(item, index) in albumMusicInfo" :key="index" style="margin-top:45px;">
      <el-col :span='4' :offset="2">
        <el-image :src='item.album.picUrl' style="width:150px;height:150px;"></el-image>
        <span style="position:absolute;left:140px;top:150px;">{{item.album.publishTime | dateFormatToYMD}}</span>
      </el-col>
      <el-col :span='14'>
        {{item.album.name}}
        <el-table 
          :data='item.songs' 
          highlight-current-row
          stripe
          :show-header="false"
          @row-dblclick='playAlbumMusic'
          style="margin-top:15px;cursor:context-menu;border:1px solid rgb(230,230,230)"
        >
          <el-table-column type="index">
            <template scope="scope">
              <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
              <p v-else>{{scope.$index+1 >= 10 ? scope.$index+1 : ('0'+(scope.$index+1)).toString()}}</p>
            </template>
          </el-table-column>

          <el-table-column width="70px;">
            <template>
              <i class="el-icon-star-off" style="font-size:18px;cursor:pointer"></i>
              <i class="el-icon-download" style="margin-left:10px;font-size:18px;cursor:pointer;"></i>
            </template>
          </el-table-column>

          <el-table-column v-if="false" label="id" prop="id"></el-table-column>
          <el-table-column prop="name"></el-table-column>
          <el-table-column prop="dt" width="80px"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-pagination
      background
      layout='prev,next'
      :page-size='queryInfo.limit'
      @current-change='handleCurrentChange'
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return {
      queryInfo:{
        id: this.$route.params.id,
        limit: 4,
        offset: 0
      },
      singerId: this.$route.params.id,
      hot50Songs: [],
      defaultShow: 10,
      curId: parseInt(window.localStorage.getItem('curPlayMusicId')),
      hotAlbum: [],
      albumMusicInfo: []
    }
  },
  created() {
    this.getHot50Music()
    this.getHotAlbum()
    window.addEventListener('setItem',()=>{
      this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
    })
  },
  methods: {
    getHot50Music() {
      this.$http.get('artist/top/song',{params:{id:this.singerId}}).then(res=>{
        this.hot50Songs = res.data.songs;
        this.hot50Songs.forEach(item=>{
          const dt = new Date(item.dt)
          const mm = (dt.getMinutes() + '').padStart(2,'0')
          const ss = (dt.getSeconds() + '').padStart(2,'0')

          item.dt = mm + ':' + ss
        })
      })
    },
    changeDefaultNum(){
      this.$('.show').remove()
      this.defaultShow = 50
    },
    getHotAlbum(){
      this.$http.get('artist/album',{params:this.queryInfo}).then(res=>{
        this.hotAlbum = res.data.hotAlbums
        this.hotAlbum.forEach(item=>{
          this.$http.get('album',{params:{id:item.id}}).then(res=>{
            res.data.songs.forEach(item=>{
              const dt = new Date(item.dt)
              const mm = (dt.getMinutes() + '').padStart(2,'0')
              const ss = (dt.getSeconds() + '').padStart(2,'0')

              item.dt = mm + ':' + ss
            })
            this.albumMusicInfo.push(res.data)
          })
        })
        // this.albumMusicInfo.push(res.data)
      })
    },
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getHotAlbum()
    },
    playHot50Music(row){
      var playList = []
      this.hot50Songs.forEach(item=>{
        playList.push(item.id)
      })
      this.$emit('setSongListInfo',playList,row.id)
    },
    playAlbumMusic(row){
      this.$emit('setSongListInfo',window.localStorage.getItem('playList'),row.id)
    }
  }
}
</script>