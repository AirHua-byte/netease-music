<template>
  <el-container style="height:100%">
    <el-header>
      <img src="imgs/logo.png" alt="" class="logo" @click="goHome" style="cursor:pointer">
      <span @click="goHome" style="cursor:pointer">网抑云</span>
      <el-input placeholder="搜索单曲,歌手,视频,歌单" v-model="searchData" size="mini" suffix-icon="el-icon-search">
        <el-button slot="suffix" class="searchBtn" size="mini" @click="toSearchPage"></el-button>
      </el-input>

      <div class="rightContainer" style="display:flex">
        <img src="imgs/userIcon.png" alt="" v-if="currentUserInfo === null" class="userIcon">
        <img :src="currentUserInfo.avatarUrl" alt="" v-else class="userIcon">

        <span v-if="currentUserInfo === null" style="cursor:pointer;" @click="handLeLogin">
          未登录
        </span>

        <span v-else>
          {{currentUserInfo.nickname}}
        </span>

        <el-button type="danger" @click="logout" v-if="currentUserInfo != null" size="mini"
          style="height:50%;margin-top:10px;margin-left:5px">
          退出
          </el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside width="210px">
        <el-menu :default-active="currentMenu" :router="true">
          <el-menu-item-group>
            <template slot="title">推荐</template>
            <el-menu-item index="/findMusic">发现音乐</el-menu-item>
            <el-menu-item index="/video">视频</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">我的音乐</template>
            <el-menu-item index="/cloudMusic">我的音乐云盘</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">创建的歌单</template>
            <el-menu-item index="/cloudMusic">温柔男声</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">收藏的歌单</template>
            <el-menu-item index="/cloudMusic">温柔女声</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view ref="child"
          @setMusicUrl="setMusicUrl" 
          :musicDuration="musicDuration"
          @refreshPrivatePlaylist="getUserPrivatePlayList"
          :isPlay="isPlay"
          :curId="curId"
          @setSongListInfo="setSongListInfo"></router-view>
        </el-main>
      </el-container>
    </el-container>

    <el-footer style="position:fixed;bottom:0;width:100%;z-index:100" height="150px;">
      <el-row style="width:209px;backgroud-color:white">
        <el-col :span="8">
          <img :src="music.al.picUrl" alt="" @click="toMusicDetailPage"
           style="width:60px;height:63px;cursor:pointer;">
        </el-col>
        <el-col :span="16">
          <p style="height:8px;font-size:10px;">{{music.name}}</p>
          <br>
          <span style="color:gray;font-size:10px;">{{music.ar[0].name}}</span>
        </el-col>
      </el-row>

      <el-row style="margin-top:10px;border-top:1px solid rgb(230,230,230);background-color:white">
        <el-col :span="2.5">
          <img src="imgs/prev.png" alt="" @click="changePrevMusic" style="border-radius:100%;cursor:pointer;">
          <img v-if="isPlay" src="imgs/pauseMusic.png" alt="" @click="playMusic" style="border-radius:100%;cursor:pointer;margin-left:25px;width:40px;height:40px;">
          <img v-else src="imgs/playMusic.png" alt="" @click="playMusic" style="border-radius:100%;cursor:pointer;margin-left:25px;width:40px;height:40px;">
          <img src="imgs/next.png" alt="" @click="changeNextMusic" style="border-radius:100%;cursor:pointer;margin-left:25px;">
        </el-col>

        <el-col :span="15" :offset="1">
          <span style="position:absolute;top:9px">{{this.musicDuration | timeFormat}}</span>
          <el-slider v-model="musicDuration" :max="totalDuration" @change="musicDurationChange" :show-tooltip="false"></el-slider>
          <span style="position:absolute;left: 71%;bottom: 25%">{{totalDuration | timeFormat}}</span>
        </el-col>

        <el-col :span="5">
          <img src="imgs/laba.png" alt="" v-if="musicVolume!==0" @click="silence" class="laba">
          <img src="imgs/shutUp.png" alt="" v-else @click="silence" class="laba">
          <img src="imgs/songList.png" alt="" @click="showRightPlayList" style="position:absolute;top:10px;right:9%;cursor:pointer;">

          <el-slider v-model="musicVolume" :show-tooltip="false" style="width:40%" @change="musicVolumeChange"></el-slider>
        </el-col>
      </el-row>

      <audio :src="musicUrl" autoplay class="playMusicAudio"></audio>
    </el-footer>

    <el-dialog :modal="false" 
                :show-close="false"
                title="播放列表"
                :visible.sync="showRightPlayListDialog"
                width="30%"
                center>
      <el-table
        :data="currentMusicListInfo"
        ref="playTable"
        stripe
        highlight-current-row
        @row-dblclick="playRightMusicList"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="#"
          type="index">
          <template scope="scope">
            <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
            <p v-else>{{scope.$indedx+1}}</p>
          </template>
        </el-table-column>
        <el-table-column
          v-if="false"
          prop="id"
          label="id">
        </el-table-column>
        <el-table-column
          prop="name"
          label="音乐标题">
        </el-table-column>
        <el-table-column
          prop="ar[0].name"
          label="歌手">
        </el-table-column>
        <el-table-column
          prop="al.name"
          label="专辑名">
        </el-table-column>
        <el-table-column
          prop="dt"
          label="时长"
          width="80px">
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="loginDialogVisible"
      width="30%"
      @close="handLeLoginDialogClosed">
      <div>
        <img src="img/phone.png" alt="" style="display:block;margin:0 auto">
        <el-form :model="loginInfo" :rules="loginInfoRules" ref="loginInfoRuleForm" style="margin-top:25px;">
          <el-form-item prop="phone">
            <el-input style="display:block;margin:0 auto;width:60%" prefix-icon="el-icon-user"
              v-model="loginInfo.phone" placeholder="请输入手机号">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input style="display:block;margin:0 auto;width:60%" show-password
              prefix-icon="el-icon-lock" v-model="loginInfo.password" type="password"
              placeholder="请输入密码">
            </el-input>
          </el-form-item>
        </el-form>
        <el-button @click="loginMusic" type="danger"
          style="backgroud-color:red;width:60%;display:block;margin:0 auto">登录</el-button>
      </div>

    </el-dialog>
  </el-container>
</template>

<script>
import SearachPage from "./findMusic/search/SearchPage";
export default {
  name: 'Main',
  data(){
    return {
      // 播放音乐的链接
      musicUrl:'',
      // 当前音乐详情对象
      music:{
        name,
        al:{
          picUrl:''
        },
        ar:[
          {
            name:''
          }
        ]
      },
      // 当前音乐的进度条
      musicDuration:0,
      // 当前音乐的id
      curId:0,
      // 总进度条
      totalDuration:0,
      // 音乐的音量
      musicVolume:20,
      // 默认是否在播放
      isPlay:false,
      // 播放列表
      playListInfo:window.localStorage.getItem('playlist') === null?[]:window.localStorage.getItem('playList').split(','),
      // 当前播放歌单所有歌曲的url和其他信息
      currentMusicListInfo:[],
      // 当前播放的歌单id
      songListInfo:[],
      // 展示右边歌单对话框
      showRightPlayListDialog:false,
      // 展示登录对话框
      loginDialogVisible:false,
      // 登录信息
      loginInfo:{
        phone:'',
        password:''
      },
      // 登录校验
      loginInfoRules:{
        phone:[
          {required:true,message:' ',trigger:'blur'}
        ],
        password:[
          {required:true,message:' ',trigger:'blur'}
        ]
      },
      // 当前用户信息
      currentUserInfo:window.localStorage.getItem('currentUserInfo') === 'null' ? null : JSON.parse(window.localStorage.getItem('currentUserInfo')),
      // 当前用户歌单
      currentUserPlayList:[],
      // 搜索条件
      searchData: '六月的雨',
      currentMenu: '/findMusic'
    }
  },
  watch:{
    curId(newVal){
      this.resetSetItem('curPlayMusicId',newVal)
    }
  },
  created(){
    this.getUrl()
    this.curId = window.localStorage.getItem('curPlayMusicId')
    this.$http.get('song/url',{params:{id:this.curId}}).then(res=>{
      this.musicUrl = res.data.data[0].url
      this.$http.get('song/detail',{params:{ids:this.curId}}).then(res=>{
        this.music = res.data.songs[0]
      })
      this.setAudioTagsInfo(false)
      let audio = this.$('.playMusicAudio')[0]
      audio.pause()
    })
  },
  methods: {
    goHome() {
      this.$router.replace('/')
    },
    toSearchPage(){
      if(this.searchData.trim()!==''){
        /* 
        this.$router.push()
        描述：跳转到不同的url，但这个方法会向history栈添加一个记录，点击后退会返回到上一个页面。

        this.$router.replace()
        描述：同样是跳转到指定的url，但是这个方法不会向history里面添加新的记录，点击返回，会跳转到上上一个页面。上一个记录是不存在的。
        */
        this.$router.replace('/search/' + encodeURIComponent(this.searchData))
        // this.$refs.child.toSingSearchPage()
      }
    },
    handLeLogin(){
      this.loginDialogVisible = true
    },
    setMusicUrl(mUrl,detail){
      this.musicUrl = mUrl
      this.music = detail
      let id = detail.id
      this.curId = id
      this.playListInfo.push(detail.id)
      this.setAudioTagsInfo(true)
    },
    setAudioTagsInfo(flag){
      let audio = this.$('.playMusicAudio')[0]
      audio.addEventListener('timeupdate',()=>{
        this.totalDuration = audio.duration
        this.musicDuration = audio.currentTime
        if(audio.currentTime>=audio.duration){
          this.changeNextMusic()
        }
      })
      if(flag) {
        this.isPlay = true
      }else{
        setTimeout(() => {
          audio.pause()
        }, 200);
      }
    },
    getUserPrivatePlayList(){
      this.$http.get('user/playlist',{params:{uid: this.currentUserInfo.userId}}).then(res=>{
        this.currentUserPlayList = res.data.playlist
      })
    },
    async setSongListInfo(songList,curId){
      this.playListInfo = songList
      window.localStorage.setItem('playList',songList)

      const res = await this.$http.get('song/url',{params:{id:curId}})
      console.log(curId)
      console.log(res.data)
      if(res.data.data[0].url === null){
        this.$message.info('当前歌曲暂不可用,已为您自动跳过')
        this.curId = curId
        this.changeNextMusic()
      }else{
        this.musicUrl = res.data.data[0].url
        this.$http.get('song/detail',{params:{ids:curId}}).then(res=>{
          this.music = res.data.songs[0]
        })
        this.curId = curId
        this.setAudioTagsInfo(true)
      }
    },
    toMusicDetailPage(){
      this.$router.push('/musicDetail/' + this.curId)
    },
    playMusic(){
      let audio = this.$('.playMusicAudio')[0]
      if(this.musicUrl !== ''){
        if(!audio.paused){
          audio.pause()
        }else{
          audio.play()
        }
        this.isPlay = !this.isPlay
      }
    },
    changePrevMusic(){
      const prevOne = this.playListInfo[this.playListInfo.findIndex(target=>{
        return target === this.curId
      })-1];
      this.setSongListInfo(this.playListInfo,prevOne)
    },
    changeNextMusic(){
      const nextOne = this.playListInfo[this.playListInfo.findIndex(target=>{
        return target === this.curId
      })+1];
      this.setSongListInfo(this.playListInfo,nextOne)
    },
    musicDurationChange(){
      if(this.totalDuration === 0) return
      let audio = this.$('.playMusicAudio')[0]
      audio.currentTime = this.musicDuration
    },
    silence(){
      if(this.musicVolume !== 0){
        this.volumeChange(0)
        this.musicVolume = 0
      }else{
        this.volumeChange(0.2)
        this.musicVolume = 20
      }
    },
    musicVolumeChange(){
      this.volumeChange(this.musicVolume/100)
    },
    volumeChange(sum){
      let audio = this.$('.playMusicAudio')[0]
      audio.volume = sum
    },
    showRightPlayList(){
      this.showRightPlayListDialog = true
      this.$http.get('song/detail',{params:{ids:window.localStorage.getItem('playList')}}).then(res=>{
        this.currentMusicListInfo = res.data.songs
        this.currentMusicListInfo.forEach(item=>{
          const dt = new Date(item.dt)
          const mm = (dt.getMinutes()+'').padStart(2,'0')
          const ss = (dt.getSeconds()+'').padStart(2,'0')
          item.dt = mm+':'+ss
        })
      })
    },
    playRightMusicList(){

    },
    handLeLoginDialogClosed(){
      this.$refs.loginInfoRuleForm.resetFields();
    },
    loginMusic(){
      this.$refs.loginInfoRuleForm.validate(valid => {
        if(!valid) return this.$message.error('请填写正确的信息')
        this.$http.get('login/cellphone',{params:this.loginInfo}).then(res=>{
          if(res.status !== 200) return this.$message.error('登录失败,请检查登录信息！')
          // 保存cookie的信息
          window.localStorage.setItem('musicCookie',res.data.cookie)
          // 保存用户信息，退出时删除
          window.localStorage.setItem('currentUserInfo',JSON.stringify(res.data.profile))
          // 放入用户信息
          this.currentUserInfo = res.data.profile

          this.getUserPrivatePlayList()

          this.loginDialogVisible = false
        })
      })
    },
    logout(){
      this.$http.get('logout').then(res => {
        this.currentUserInfo = null
        window.localStorage.setItem('currentUserInfo',null)
        this.currentUserPlayList = []
      })
    },
    getUrl() {
      let hashUrl = window.location.href.split('#')[1]
      if(hashUrl.includes('ideo') || hashUrl.includes('mv'))
      {
        this.currentMenu = '/video'
      }if(hashUrl === '/diyRecommend'){
        this.currentMenu = '/findMusic'
      }
    }
  },
  components:{
    child:SearachPage
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: rgb(198,47,47);
  height: 50px;
  display: flex;
  .logo{
    width: 25px;
    height: 25px;
    margin: 15px 10px;
    border-radius: 100px;
  }
  span{
    font-size: 20px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: 500;
    margin-top: 15px;
    color: white;
  }
  .el-input{
    width: 275px;
  }
  ::v-deep .el-input__inner{
    opacity: 0.4;
    margin-top: 15px;
    margin-left: 50px;
    width: 225px;
    height: 25px;
    border-radius: 12px;
  }
  .searchBtn{
    opacity: 0;
    position: absolute;
    float: right;
    // width: 1px;
    height: 24px;
    left: -3px;
    margin-top: 15px !important;
    border-radius: 60%;
  }
}
.rightContainer{
  margin-left: auto;
  span{
    font-size: 17px;
    color: white;
  }
  .userIcon{
    width: 30px;
    height: 30px;
    border-radius: 60%;
    margin-top: 13px;
    margin-right: 10px;
  }
}
::v-deep .el-menu-item-group__title{
  padding-left: 5px !important;
  margin-top: 7px;
}
.el-menu-item{
  height: 45px;
  line-height: 3.45rem;
}
.el-menu-item.is-active{
  color: black;
  border-left: 2px solid red  !important;
}
.el-menu{
  height: 92%;
}
::v-deep .el-slider__button{
  width: 10px !important;
  height: 10px !important;
  border:2px solid rgb(198,47,47) !important;
}
::v-deep  .el-slider__bar{
  background-color: rgb(198,47,47);
}
.el-slider{
  width: 80%;
  margin: 0 auto;
}
.laba{
  position: absolute;
  top: 6px;
  right: 20%;
  cursor: pointer;
}
.el-footer{
  padding: 0;
  // background-color: #fff;
}
</style>