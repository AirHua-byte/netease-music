<template>
  <el-row style="margin-bottom:150px;">
    <el-col :span='12' :offset="2">
      <el-row>
        <el-tag size='mini' type="danger" style="background-color: white;border:1px solid red;">视频</el-tag>
        <span style="margin-left: 10px;">{{videoDetailInfo.data.title}}</span>
        <span style="margin-left: 10px;font-size:5px;">{{videoDetailInfo.data.creator.nickname}}</span>
      </el-row>

      <el-row style="margin-top:5px;">
        <video :src="videoUrl" width="100%" height="480" autoplay controls style="background-color:black">
          很抱歉，您的浏览器当前不支持最新播放标签！
        </video>
      </el-row>

      <el-row>
        <p style="margin-top:15px;font-size:18px;">评论({{commentTotal}})</p>
        <h4 style="font-weight:300" v-if="queryInfo.offset === 0 && videoHotComment.length !== 0">精彩评论</h4>

        <div 
          v-for="(item, index) in videoHotComment" 
          :key="index"
          style="position:relative;border-top:2px solid rgb(240,240,242);border-bottom:1px solid rgb(240,240,242);padding:15px  0;font-size:15px;"
        >
          <div>
            <img 
              :src="item.user.avatarUrl" 
              alt=""
              style="display:inline;width:50px;height:50px;border-radius:25px;"
            >
            <div style="margin-left:60px;margin-top:-60px;">
              <p><span style="color:#4d99de">{{item.user.nickname}}</span>：{{item.content}}</p>
              <br v-if="item.beReplied.length > 0">
              <div 
                v-if="item.beReplied.length > 0"
                style="background-color:rgb(241,241,244);padding:5px 5px;"  
              >
                <p v-for="(citem,idx) in item.beReplied" :key="idx">
                  <span style="color:#4d99de;">@{{citem.user.nickname}}</span>：{{citem.content}}
                </p>
              </div>

              <p style="display:block;font-size:13px;color:gray;opacity:0.7">{{item.time | dateFormat}}</p>
            </div>
          </div>
        </div>

        <h4 style="font-weight:300;margin-top:25px;">最新评论</h4>
        <div>
          <div 
            v-for="(item,index) in videoCommentList" 
            :key="index"
            style="position:relative;border-top:2px solid rgb(240,240,242);border-bottom:1px solid rgb(240,240,242);padding:15px 0;font-size:15px;"
          >
            <div>
              <img 
                :src="item.user.avatarUrl" 
                alt=""
                style="display:inline;width:50px;height:50px;border-radius:25px;"
              >
              <div
                style="margin-left:60px;margin-top:-60px;"
              >
                <p><span style="color:#4d99de;">{{item.user.nickname}}</span>：{{item.content}}</p>
                <br v-if="item.beReplied.length > 0">
                <div v-if="item.beReplied.length > 0"
                  style="background-color:rgb(241,241,244);padding:5px 5px;"  
                >
                  <p v-for="(citem,idx) in item.beReplied" :key="idx">
                    <span style="color:#4d99de;">{{citem.user.nickname}}</span>：{{citem.content}}
                  </p>
                </div>

                <p style="display:block;font-size:13px;color:gray;opacity:0.7">{{item.time | dateFormat}}</p>
              </div>
            </div>
          </div>
        </div>

        <el-pagination
          background
          :page-size="queryInfo.limit"
          layout='prev,pager,next'
          :total="commentTotal"
          @current-change='handleCurrentChange'
        >
        </el-pagination>
      </el-row>
    </el-col>

    <el-col :span="7" :offset="1">
      <el-row style="border-bottom:1px solid rgb(230,230,230);padding-bottom:10px;">
        <span style="margin-left:10px;font-size:20px;font-weight:400;">视频介绍</span>
      </el-row>

      <el-row style="margin-top:10px;margin-left:12px;">
        <span style="font-size:14px;">
          发布时间：<span style="font-size:14px;">{{videoDetailInfo.data.publishTime | dateFormat}}</span>
        </span>

        <span style="font-size:14px;margin-left:15px;float:right">
          播放次数：<span style="font-size:14px;">{{(videoDetailInfo.data.playTime/10000).toFixed(0)+'万次'}}</span>
        </span>
      </el-row>

      <el-row style="margin-top:10px;margin-left:12px;">
        <p style="font-size:14px;font-weight:400;">简介：{{videoDetailInfo.data.description}}</p>
      </el-row>

      <el-row style="margin-top:45px;border-bottom:1px solid rgb(230,230,230);padding-bottom:10px;">
        <span style="margin-left:10px;font-size:20px;font-weight:400">相关推荐</span>
      </el-row>

      <el-row v-for="(item,index) in simiVideoList" :key="index" style="margin-top:25px;">
        <el-col :span='12'>
          <el-image :src='item.coverUrl' @click="toVideoPage(item.vid)" style="border-radius:5px;cursor:pointer;"></el-image>
          <div style="background: rgba(128,128,128,0.2);color:white;width:50%;position:absolute;z-index:10;top:2px;left:0;">
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{(item.playTime/10000).toFixed(0)}}万
            </div>
          </div>
        </el-col>

        <el-col :span='10' :offset="1">
          <el-tag size='mini' type="danger" style="background-color:white;border:1px solid red">视频</el-tag>
          <span style="margin-left:10px;cursor:pointer;" @click="toVideoPage(item.vid)">{{item.name}}</span>
          <p style="font-size:15px;opacity:0.7;">{{item.durationms/1000 | timeFormat}}</p>
          <p style="font-size:15px;opacity:0.7;">{{item.creator[0] !== 'undefined'? item.creator[0].userName : ''}}</p>
        </el-col>
      </el-row>

    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      // 当前id
      curVideoId: this.$route.params.id,
      // 当前视频详细数据
      videoDetailInfo: {
        data: {
          title: '',
          creator: {
            nickname: ''
          }
        }
      },
      // 当前视频url
      videoUrl: '',
      // 查询当前评论数据的查询条件
      queryInfo: {
        id: this.$route.params.id,
        offset: 0,
        limit: 10
      },
      // 当前视频评论数据
      videoCommentList: [],
      // 当前视频评论数量
      commentTotal: 0,
      // 当前视频精彩评论
      videoHotComment: [],
      // 与当前视频相关的视频
      simiVideoList: [
        {
          creator: [
            {
              userName: ''
            }
          ]
        }
      ]
    }
  },
  created() {
    // 获取当前详细数据
    this.getVideoDetailInfo()
    // 获取当前url
    this.getVideoUrl()
    // 获取评论数据
    this.getCommentList()
    // 获取相关视频
    this.getSimiVideos()
  },
  methods: {
    getVideoDetailInfo() {
      this.$http.get('/video/detail',{params:{id:this.curVideoId}}).then(res=>{
        this.videoDetailInfo = res.data
      })
    },
    getVideoUrl() {
      this.$http.get('/video/url',{params:{id:this.curVideoId}}).then(res=>{
        this.videoUrl = res.data.urls[0].url
      })
    },
    getCommentList() {
      this.$http.get('/comment/video',{params:this.queryInfo}).then(res=>{
        this.videoCommentList = res.data.comments
        this.commentTotal = res.data.total
        this.videoHotComment = res.data.hotComments
      })
    },
    getSimiVideos() {
      this.$http.get('/related/allvideo',{params:{id:this.curVideoId}}).then(res=>{
        this.simiVideoList = res.data.data
      })
    },
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getCommentList()
    },
    toVideoPage(id) {
      this.$router.push('/videoPlay/' + id)
      document.location.reload()
    }
  }
}
</script>