<template>
  <el-container style="margin-top:25px;margin-bottom:45px;">
    <el-header height="300px">
      <el-carousel type="card" height="300px;">
        <el-carousel-item v-for="(item,index) in bannerInfo" :key="index">
          <el-image @click="changeUrl(item.targetId)" :src="item.imageUrl" fit="contain" style="height:300px;">
          </el-image>
          <el-tag :type="item.typeTitle === '独家'?'danger':'primary'" effect="dark"
          style="position:absolute;top:85%;left:90%;border-radius:14px;">{{item.typeTitle}}</el-tag>
        </el-carousel-item>
      </el-carousel>
    </el-header>

    <el-main>
      <el-row style="border-bottom:2px solid rgb(230,230,230)">
        <p style="margin-bottom:10px;font-size:22px;">推荐歌单</p>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="4" v-for="(item,index) in musicList" :key="index"
        style="margin-top:20px;position:relative;">
          <div style="background:rgba(128,128,128,0.2);color:white;
            width:96%;position:absolute;z-index:10;" >
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right:5px"></i>  
              {{item.playCount>=10000?(item.playCount/10000).toFixed(0)+'万':item.playCount}}
            </div> 
          </div>
          <div>
            <el-image :src="item.coverImgUrl" @click="toSongListPage(item.id)"
              style="box-shadow:0 0 2px 2px gray;border-radius:10px;cursor:pointer"></el-image>
          </div>
          <h1 @click="toSongListPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>
        </el-col>
      </el-row>

      <el-row style="border-bottom:2px solid rgb(230,230,230)">
        <p style="margin-bottom:10px;font-size:22px;">独家放送</p>
      </el-row>

      <el-row :gutter="40" style="margin-top:25px;">
        <el-col :span="8" v-for="item in privateList" :key="item.id">
          <i class="el-icon-video-play"
            style="color:rgba(255,255,255,0.4);font-size:45px;position:absolute;top:10px;z-index:10"></i>
            <el-image @click="toVideoPage(item.id)" :src="item.sPicUrl"
              style="box-shadow:0 0 2px 2px gray;border-radius:5px;cursor:pointer;"></el-image>
            <h1 @click="toVideoPage(item.id)" style="cursor:pointer">{{item.name}}</h1>
        </el-col>
      </el-row>

      <el-row style="border-bottom:2px solid rgb(230,230,230)">
        <p style="margin-bottom:10px;font-size:22px;">最新音乐</p>
      </el-row>

      <el-row style="margin-top:25px;">
        <el-col :span="12">
          <el-table 
          :data="newMusicList.slice(0,5)" 
          stripe 
          @row-dblclick="dblclickPlayMusic"
          :show-header="false">
            <el-table-column type="index">
              <template scope="scope">
                {{'0'+(scope.$index+1).toString()}}
              </template>
            </el-table-column>
            <el-table-column>
              <template scope="scope">
                <i class="el-icon-video-play" 
                @click="changeUrl(scope.row.id)"
                style="position:absolute;font-size:25px;top:35px;left:35px;z-index:10;cursor:pointer;"></i>
                <el-image :src="scope.row.picUrl" @click="changeUrl(scope.row.id)"
                style="width:75px;height:75px;cursor:pointer;"></el-image>
                <span style="position:absolute;top:25px;font-size:15px;font-weight:500">
                  {{scope.row.name}}
                </span>
                <span @click="toSingerPage(scope.row)"
                style="cursor:pointer;position:absolute;bottom:25px;font-size:12px;font-weight:500">
                  {{scope.row.song.artists[0].name}}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="12">
          <el-table 
          :data="newMusicList.slice(5)" 
          @row-dblclick="dblclickPlayMusic" 
          stripe
          :show-header="false">
            <el-table-column type="index">
              <template scope="scope">
                {{scope.$index >= 4 ? scope.$index+6 : '0' + (scope.$index+6).toString()}}
              </template>
            </el-table-column>
            <el-table-column>
              <template scope="scope">
                <i class="el-icon-video-play" @click="changeUrl(scope.row.id)"
                  style="position: absolute;font-size: 25px;top: 35px;left:35px;z-index: 10;cursor:pointer;"></i>
                <el-image 
                :src="scope.row.picUrl" 
                @click="changeUrl(scope.row.id)"
                style="wdith:75px;height:75px;cursor:pointer;"></el-image>
                <span style="position: absolute;top: 25px;font-size: 15px;font-weight: 500">
                  {{scope.row.name}}
                </span>
                <span @click="toSingerPage(scope.row)"
                  style="cursor:pointer;position: absolute;bottom: 25px;font-size: 12px;font-weight: 500">
                    {{scope.row.song.artists[0].name}}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      // 轮播图数据列表
      bannerInfo:[],
      // 需要播放的音乐地址
      musicUrl:'',
      // 当前音乐的详情对象
      music:{},
      // 推荐歌单的数据
      musicList:[],
      // 独家放送信息
      privateList:[],
      // 最新音乐的推送列表
      newMusicList:[]
    }
  },
  created(){
    this.getBannerInfo()
    this.getMusicList()
    this.getPrivateList()
    this.getNewMusicList()
  },
  methods:{
    getBannerInfo(){
      this.$http.get('banner').then(res => {
        if(res.status !== 200) this.$message.error('轮播图数据获取失败');
        this.bannerInfo = res.data.banners
      })
    },
    getMusicList(){
      this.$http.get('/top/playlist',{
        params:{
          offset: (Math.random()*1297).toFixed(0) - 12,
          limit: 12
        }
      }).then(res => {
        this.musicList = res.data.playlists;
      })
    },
    getPrivateList(){
      this.$http.get('/personalized/privatecontent').then(res=>{
        this.privateList = res.data.result
      })
    },
    getNewMusicList(){
      this.$http.get('personalized/newsong').then(res=>{
        this.newMusicList = res.data.result
      })
    },
    toSongListPage(id){
      this.$router.push('/songlist/'+id)
    },
    toVideoPage(mvId){
      this.$router.push('/toVideoPage/'+mvId)
    },
    async changeUrl(musicId){
      if(musicId === null) return
      await this.getMusicUrl(musicId)
      await this.getMusicDetail(musicId)

      if(this.musicUrl !== ''){
        this.$emit('setParentMusicUrl',this.musicUrl,this.music)
      }
    },
    async getMusicUrl(musicId){
      const res = await this.$http.get('song/url',{params:{id:musicId}})
      this.musicUrl = res.data.data[0].url
    },
    async getMusicDetail(musicId){
      await this.$http.get('song/detail',{params:{ids:musicId}}).then(res=>{
        this.music = res.data.songs[0]
      })
    },
    dblclickPlayMusic(row){
      this.changeUrl(row.id)
    },
    toSingerPage(row){
      this.$router.push('/singer/' + row.song.artists[0].id)
    }
  }
}
</script>

<style lang="less" scoped>
[class*=el-col-]{
  display: inline-block;
  float: none;
}
h1{
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>