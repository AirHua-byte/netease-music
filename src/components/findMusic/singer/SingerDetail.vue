<template>
  <el-container>
    <el-header height='320px'>
      <el-row :span='8'>
        <el-image 
          :src='singerInfo.artist.img1v1Url' 
          style="width: 300px;height: 300px;border-radius:10px;">
        </el-image>
        <el-tag
          type="danger"
          style="position: absolute;left: 330px; border:1px solid rgb(198,47,47); background-color: rgb(198,47,47);color: white">
          歌手
        </el-tag>
        <span style="position:absolute;left:390px;top:2px;font-size: 20px;">{{singerInfo.artist.name}}</span>
        <i class="el-icon-headset" style="position: absolute;font-size: 15px; top:80px; left: 330px;">
           单曲数：{{singerInfo.artist.musicSize}}
        </i>
        <i class="el-icon-first-aid-kit" style="position:absolute;font-size:15px;top:120px;left:330px;">
           专辑数：{{singerInfo.artist.albumSize}}
        </i>
        <i class="el-icon-video-play" style="position:absolute;font-size:15px;top:160px;left:330px;">
           MV数：{{singerInfo.artist.mvSize}}
        </i>
      </el-row>
    </el-header>

    <el-main>
      <el-menu :default-active='/album/+`${this.singerId}`' :router="true" mode="horizontal">
        <el-menu-item :index='/album/+`${this.singerId}`'>专辑</el-menu-item>
        <el-menu-item :index='/singerMv/+`${this.singerId}`'>MV</el-menu-item>
        <el-menu-item :index='/singerDesc/+`${this.singerId}`'>歌手详情</el-menu-item>
      </el-menu>
      <router-view @setSongListInfo='setSongListInfo'></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      singerId: this.$route.params.id,
      singerInfo: {
        artist: {
          img1v1Url: ''
        }
      }
    }
  },
  created() {
    this.getSingerInfo()
  },
  methods: {
    getSingerInfo() {
      this.$http.get('artists',{params: {id:this.singerId}}).then(res=>{
        this.singerInfo = res.data
      })
    },
    setSongListInfo(playList,curId){
      this.$emit('setSongListInfo',playList,curId)
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