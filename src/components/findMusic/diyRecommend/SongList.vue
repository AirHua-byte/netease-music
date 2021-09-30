<template>
  <el-container style="margin-bottom:55px;">
    <el-header height='220px;'>
      <el-row>
        <img :src="currentSongList.coverImgUrl" alt="" style="width:220px;height:220px;" />
        <!-- <div style="float:right;color:gray">
          <div style="opacity:0.6">
            <p>歌曲数 | </p>
          </div>
        </div> -->
        <el-tag type="danger" style="background-color:white;position:absolute;top:0;left:240px;">精品歌单</el-tag>
        <h2 style="position:absolute;top:-20px;left:320px;font-weight:400">{{currentSongList.name}}</h2>

        <img :src="currentSongList.creator.avatarUrl" alt="" style="width:35px;height:35px;border-radius:50%;position:absolute;top:50px;left:240px;" />
        <span style="position:absolute;top:57px;left:280px">{{currentSongList.creator.nickname}}</span>
        <span style="position:absolute;top:57px;left:380px;opacity:0.7;">{{currentSongList.createTime | dateFormat}}创建</span>

        <el-button 
          type="danger"
          size='mini'
          icon='el-icon-video-play'
          style="position:absolute;top:100px;left:240px;"
          @click="setSongListInfo(playList,playList[0])"
        >
        播放全部
        </el-button>
        <el-button
          icon='el-icon-folder-add'
          size='mini'
          @click="subscripe(currentSongList.id)"
          style="position:absolute;top:100px;left:340px;color:black"
        >
        收藏{{currentSongList.subscribedCount}}
        </el-button>
        <el-button
          icon='el-icon-share'
          size='mini'
          style="position:absolute;top:100px;left:480px;color:black"
        >
        分享{{currentSongList.shareCount}}
        </el-button>

        <span style="position:absolute;top:150px;left:240px;">
          标签：
          <span style="color:rgb(12,115,194);cursor:pointer" v-for="(item, index) in currentSongList.tags" :key="index">
            {{index+1 === currentSongList.tags.length ? item : item + '/'}}
          </span>
        </span>

        <el-collapse style="position:absolute;top:180px;left:240px;boder:none;z-index:999">
          <el-collapse-item :title="'简介：' + (currentSongList.description + '').substr(0,26) + '...'">
            <p>{{currentSongList.description}}</p>
          </el-collapse-item>
        </el-collapse>
      </el-row>
    </el-header>

    <el-main>
      <el-menu 
        default-active="1"
        class='el-menu-demo'
        mode='horizontal'
        style="width:280px;"
      >
        <el-menu-item index='1' @click="toMusicListPage">歌曲列表</el-menu-item>
        <el-menu-item index='2' @click="toCommentPage">评论{{currentSongList.commentCount}}</el-menu-item>
      </el-menu>

      <router-view ref='child' @setSongListInfo='setSongListInfo'></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      currentId: this.$route.params.id ? this.$route.params.id : window.localStorage.getItem('currentId'),
      currentSongList: {
        creator: {
          avatarUrl: '',
          nickname: ''
        },
        trackIds: []
      },
      queryIds: '',
      playList: window.localStorage.getItem('playList') === null ? [] : window.localStorage.getItem('playList').split(',')
    }
  },
  created() {
    this.getSongListInfo()
    window.addEventListener('setItem',()=>{
      this.currentId = parseInt(localStorage.getItem('currentId'))
      this.getSongListInfo()
    })
  },
  mounted() {
    window.localStorage.setItem('currentId',this.currentId)
  },
  methods: {
    getSongListInfo(){
      this.$http.get('playlist/detail',{params:{id:this.currentId}}).then(res=>{
        this.currentSongList = res.data.playlist
        const href = window.location.href
        if(href.substring(href.lastIndexOf('/'),href.length) !== '/musicPage'){
          this.toMusicListPage()
        }
      })
    },
    toMusicListPage() {
      var queryIds = ''
      this.currentSongList.trackIds.forEach(item=>{
        queryIds += item.id + ','
      })
      this.$router.push({
        name: 'musicPage',
        params: {
          ids: queryIds.substr(0,queryIds.length-1)
        }
      })
    },
    toCommentPage() {
      this.$router.push('/comment/' + this.currentId)
    },
    setSongListInfo(songList,curId){
      this.playList = songList
      this.$emit('setSongListInfo',songList,curId)
    },
    subscripe(id){
      this.$http.get('playlist/subscribe',{params:{id:id,t:1}}).then(res=>{
        if(res.data.code === 200){
          return this.$message.success('收藏成功，数据同步需要时间!')
        }
      }).catch(err=>{
        console.log(err)
        this.$message.info('收藏失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: 0px;
}
.el-menu-item.is-active{
  color: black;
  border-bottom: 2px solid red !important;
}
</style>