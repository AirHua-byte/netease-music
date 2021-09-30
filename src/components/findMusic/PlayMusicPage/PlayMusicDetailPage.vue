<template>
  <div>
    <el-row class="topInfo">
      <el-col :span="18" :offset="3">
        <el-image
          :src="music.al.picUrl" 
          style="opacity: 0.4;border-radius:25px;z-index:-1;width: 70%;height: 600px;position:absolute;top:0;left:14%;"
        >
        </el-image>

        <el-col :span='9' :offset='2'>
          <el-image src='imgs/play-bar.png' style="width:25%;"></el-image>
          <el-image 
            src='imgs/play-bar-middle.png'
            style="position:absolute;top:-2%;left:18.5%;width:1.5%"
          ></el-image>
          <img :src="music.al.picUrl" alt="" class="musicPoster">
        </el-col>

        <el-col :span='12'>
          <h1 style="font-size:25px;font-weight:400">{{music.name}}</h1>
          <span>专辑：{{music.al.name}}</span>
          <span style="margin-left: 15px;">
            歌手：
            <span style="color: #4d99de;cursor: pointer" @click="toSingerPage(music.ar[0].id)">{{music.ar[0].name}}</span>
          </span>

          <div style="width:350px;height:350px;overflow:hidden;margin-top:25px;">
            <div style="overflow-y: auto">
              <ul ref='lyric'>
                <li
                  v-for="(item, index) in lrcObject" 
                  :key="index"
                  :style="{color:lyricIndex === index ? 'red' : 'black'}"
                >
                  {{item.c}}
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-col>
    </el-row>

    <el-main style="margin-top: 100px;margin-bottom: 75px;">
      <el-row>
        <el-col :offset='3' :span='18'>
          <h4 style="font-weight: 300" v-if="queryInfo.offset === 0">精彩评论</h4>
          <div
            v-for="(item, index) in hotCommentList" 
            :key="index"
            style="position: relative;border-top:2px solid rgb(240,240,242);border-bottom:1px solid rgb(240,240,242);padding:15px 0;font-size:15px;"
          >
            <div>
              <img 
                :src="item.user.avatarUrl" 
                alt=""
                style="display:inline;width:50px;height:50px;border-radius:25px;"
              >

              <div style="margin-left:60px;margin-top:-60px;">
                <p><span style="color: #4d99de;">{{item.user.nickname}}</span>：{{item.content}}</p>
                <br v-if="item.beReplied.length > 0">
                <div 
                  v-if="item.beReplied.length > 0"
                  style="background-color: rgb(241,241,241);padding:5px 5px;"
                >
                  <p v-for="(citem,idx) in item.beReplied" :key="idx">
                    <span style="color: #4d99de;">{{citem.user.nickname}}</span>：{{citem.content}}
                  </p>
                </div>

                <p style="display:block;font-size:13px;color:gray;opacity:0.7">{{item.time | dateFormat}}</p>
              </div>
            </div>
          </div>

          <h4 style="font-weight: 300;margin-top:25px;">最新评论({{total}})</h4>
          <div>
            <div
              v-for="(item, index) in commentList" 
              :key="index"
              style="position:relative;border-top:2px solid rgb(240,240,242);padding:15px 0;font-size:15px;"
            >
              <div>
                <img 
                  :src="item.user.avatarUrl" alt=""
                  style="display:inline;width:50px;height:50px;border-radius:25px;">

                  <div style="margin-left:60px;margin-top:-60px;">
                    <p><span style="color:#4d99de;">{{item.user.nickname}}</span>：{{item.content}}</p>
                    <br v-if="item.beReplied.length > 0">
                    <div 
                      v-if="item.beReplied.length > 0"
                      style="background-color:rgb(241,241,244);padding:5px 5px;"
                    >
                      <p v-for="(citem,idx) in item.beReplied" :key="idx">
                        <span style="color: #4d99de;">@{{citem.user.nickname}}</span>：{{citem.content}}
                      </p>
                    </div>

                    <p style="display:block;font-size:13px;color:gray;opacity:0.7">{{item.time | dateFormat}}</p>
                  </div>
              </div>
            </div>
          </div>

          <el-pagination
            layout='prev,pager,next'
            :page-size='queryInfo.limit'
            :total='total'
            @current-change='handleCurrentChange'
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curId: this.$route.params.id,
      music: {
        name,
        al: {
          picUrl: ''
        },
        ar: [
          {
            name: ''
          }
        ]
      },
      lrc: '',
      lrcObject: [],
      duration: '',
      lyricIndex: 0,
      rotate: null,
      deg: 0,
      play: this.isPlay,
      queryInfo: {
        id: this.$route.params.id,
        limit: 10,
        offset: 0
      },
      commentList: [],
      hotCommentList: [],
      total: 0
    }
  },
  props: ['musicDuration','isPlay'],
  watch: {
    musicDuration(newVal) {
      this.duration = newVal
      for(let i = 0;i < this.lrcObject.length;i++) {
        if(newVal <= parseFloat(this.lrcObject[i].t)) {
          if(this.lyricIndex === i - 1){
            break
          }
          this.lyricIndex = i - 1
          var currentTemp = this.$refs.lyric.style.marginTop
          currentTemp = currentTemp.substr(0,currentTemp.length - 2)
          currentTemp = parseInt(currentTemp)

          if(i>5){
            currentTemp = (i - 5) * -35
            this.$refs.lyric.style.marginTop = currentTemp + 'px'
          }
          if(this.lyricIndex === this.lrcObject.length - 1){
            this.lyricIndex = 0
          }
          break
        }
      }
    },
    curId(newVal) {
      this.curId = newVal
    },
    isPlay(newVal) {
      if(!newVal) {
        window.clearInterval(this.rotate)
      }else{
        this.rotate = window.setInterval(() => {
          this.$('.musicPoster').eq(0).css('transform','rotate(' + this.deg + 'deg)')
          this.deg += 1
        },30)
      }
    }
  },
  created() {
    this.getMusicDetail(this.$route.params.id)
    this.getMusicLrc()
    window.addEventListener('setItem',()=>{
      this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
      this.getMusicDetail(this.curId)
      this.getMusicLrc()
    })
    this.getMusicComment()
  },
  methods: {
    getMusicDetail(musicId) {
      this.$http.get('song/detail',{params:{ids:musicId}}).then(res=>{
        this.music = res.data.songs[0]
      })
    },
    getMusicLrc() {
      this.$http.get('lyric',{params:{id:this.curId}}).then(res=>{
        this.lrc = res.data.lrc.lyric
        this.createLrcObj(this.lrc)
      })
    },
    createLrcObj(lrc) {
      var oLRC = {
        ms: []
      }
      if (lrc.length == 0) return
      var lrcs = lrc.split('\n')
      for (var i in lrcs) {
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g,'')
        var t = lrcs[i].substring(lrcs[i].indexOf('[')+1, lrcs[i].indexOf(']'))
        var s = t.split(':')
        if(isNaN(parseInt(s[0]))) {
          for (var i in oLRC) {
            if(i != 'ms' && i == s[0].toLowerCase()) {
              oLRC[i] = s[1]
            }
          }
        }else {
          var arr = lrcs[i].match(/\[(\d+:.+?)\]/g)
          var start = 0
          for (var k in arr) {
            start += arr[k].length
          }
          // 获取歌词内容
          var content = lrcs[i].substring(start)
          for(var k in arr) {
            var t = arr[k].substring(1,arr[k].length - 1)
            var s = t.split(':')
            oLRC.ms.push({
              t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
              c: content === '' ? '.............' : content
            })
          }
        }
      }
      oLRC.ms.sort(function(a,b){
        return a.t - b.t
      })
      this.lrcObject = oLRC.ms
    },
    toSingerPage(id) {
      this.$router.push('/singer/' + id)
    },
    getMusicComment() {
      this.$http.get('comment/music',{params:this.queryInfo}).then(res=>{
        if(res.data.code !== 200) return this.$message.error('获取评论数据失败!')
        this.commentList = res.data.comments
        this.hotCommentList = res.data.hotComments
        this.total = res.data.total
      })
    },
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getMusicComment()
    }
  }
}
</script>

<style lang="less" scoped>
.musicPoster {
  position: absolute;
  border: 45px solid black;
  border-radius: 100%;
  box-shadow: 0 0 5px 5px gray;
  width: 200px;
  height: 200px;
  top: 120px;
  left: 15%;
  z-index: -1;
}
li {
  list-style: none;
  margin-top: 15px;
}
</style>