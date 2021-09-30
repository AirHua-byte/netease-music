<template>
  <el-row style="margin-bottom: 150px;">
    <el-col :span='12' :offset="2">
      <el-row>
        <el-tag size="mini" type="danger" style="background-color: white;border: 1px solid red">MV</el-tag>
        <span style="margin-left: 10px;">{{mvDetailInfo.data.name}}</span>
        <span style="margin-left: 10px;font-size:5px;">{{mvDetailInfo.data.artistName}}</span>
      </el-row>

      <el-row style="margin-top: 5px;">
        <video 
          :src="mvUrl"
          width="100%"
          height="480"
          autoplay
          controls='controls'
          style="background-color: black"
        >
          很抱歉,您的浏览器当前不支持最新播放标签！
        </video>
      </el-row>

      <el-row>
        <p style="margin-top:15px;font-size:18px;">评论({{commentTotal}})</p>
        <div style="background-color:rgb(240,240,242);height:120px;margin-top:15px;">
          <el-input
            type="text"
            show-word-limit
            maxlength="140"
            size='medium'
            style="display:inline-block;width:98%;margin:15px 15px;"
          >
          </el-input>
          <el-button
            size='mini'
            style="float:right;margin-right:14px;"  
          >
            评论
          </el-button>
        </div>

        <h4 style="font-weight:300" v-if="queryInfo.offset === 0 && mvHotComment.length !== 0">
          精彩评论
        </h4>
        <div 
          v-for="(item,index) in mvHotComment" 
          :key="index"
          style="position: relative;border-top:2px solid rgb(240,240,242);border-bottom:1px solid rgb(240,240,242);padding:15px 0;font-size:15px;"
        >
          <div>
            <img :src="item.user.avatarUrl" alt="" style="display: inline;width: 50px;height: 50px;border-radius: 25px;">
            <div style="margin-left:60px;margin-top:-60px;">
              <p><span style="color:#4d99de;">{{item.user.nickname}}</span>：{{item.content}}</p>
              <br v-if="item.beReplied.length > 0">
              <div v-if="item.beReplied.length > 0"
                style="background-color: rgb(241,241,244);padding:5px 5px;">
                <p v-for="(citem,idx) in item.beReplied" :key="idx">
                  <span style="color: #4d99de;">@{{citem.user.nickname}}</span>：{{citem.content}}
                </p>
              </div>
              <p style="display:block;font-size:13px;color:gray;opacity:0.7">{{item.time | dateFormat}}</p>
            </div>
          </div>
        </div>

        <h4 style="font-weight: 300;margin-top:25px;">最新评论({{commentTotal}})</h4>
        <div>
          <div v-for="(item,index) in mvCommentList" :key="index"
            style="position: relative;border-top:2px solid rgb(240,240,242);border-bottom:1px solid rgb(240,240,242);padding:15px 0;font-size:15px;">
            <div>
              <img :src="item.user.avatarUrl" alt="" style="display:inline;width:50px;height:50px;border-radius:25px;">

              <div style="margin-left:60px;margin-top:-60px;">
                <p><span style="color: #4d99de;">{{item.user.nickname}}</span></p>
                <br v-if="item.beReplied.length > 0">
                <div v-if="item.beReplied.length > 0"
                  style="background-color:rgb(241,241,244);padding:5px 5px;">
                  <p v-for="(citem,idx) in item.beReplied" :key="idx">
                    <span style="color: #4d99de">{{citem.user.nickname}}</span>
                  </p>
                </div>

                <p style="display:block;font-size:13px;color:gray;opacity:0.7">{{item.time | dateFormat}}</p>
              </div>
            </div>
          </div>
        </div>

        <el-pagination
          background
          layout='prev,pager,next'
          :page-size='queryInfo.limit'
          :total="commentTotal"
          @current-change='handleCurrentChange'
        >
        </el-pagination>
      </el-row>
    </el-col>

    <el-col :span='7' :offset="1">
      <el-row style="border-bottom:1px solid rgb(230,230,230);padding-bottom:10px;">
        <span style="margin-left: 10px;font-size:20px;font-weight:400">MV介绍</span>
      </el-row>

      <el-row style="margin-top:10px;margin-left:12px;">
        <span style="font-size:14px;">
          发布时间：<span style="font-size:14px;">{{mvDetailInfo.data.publishTime}}</span>
        </span>

        <span style="font-size:14px;margin-left:15px;float:right">
          播放次数：<span style="font-size:14px;">{{(mvDetailInfo.data.playCount/10000).toFixed(0)+'万次'}}</span>
        </span>
      </el-row>

      <el-row style="margin-top:10px;margin-left:12px;">
        <p style="font-size:14px;font-weight:400;">简介：{{mvDetailInfo.data.desc}}</p>
      </el-row>

      <el-row style="margin-top:45px;border-bottom:1px solid rgb(230,230,230);padding-bottom:10px;">
        <span style="margin-left:10px;font-size:20px;font-weight:400">相关推荐</span>
      </el-row>

      <el-row v-for="(item,index) in simiMvList" :key="index" style="margin-top:25px;">
        <el-col :span='12'>
          <el-image :src='item.cover' @click="toMvPage(item.id)" style="border-radius:5px;cursor:pointer;"></el-image>
          <div style="background: rgba(128,128,128,0.2);color:white;width:50%;position:absolute;z-index:10;top:2px;left:0;">
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{(item.playCount/10000).toFixed(0)}}万
            </div>
          </div>
        </el-col>

        <el-col :span='10' :offset="1">
          <el-tag size='mini' type="danger" style="background-color:white;border:1px solid red">MV</el-tag>
          <span style="margin-left:10px;cursor:pointer;" @click="toMvPage(item.id)">{{item.name}}</span>
          <p style="font-size:15px;opacity:0.7;">{{item.duration/1000 | timeFormat}}</p>
          <p style="font-size:15px;opacity:0.7;">{{item.artistName}}</p>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      curMvId: this.$route.params.id,
      mvDetailInfo: {
        data: {
          name: ''
        }
      },
      mvUrl: '',
      queryInfo: {
        id: this.$route.params.id,
        limit: 10,
        offset: 0
      },
      mvCommentList: [],
      commentTotal: 0,
      mvHotComment: [],
      simiMvList: []
    }
  },
  created() {
    this.getMvDetailInfo()
    this.getMvUrl()
    this.getMvCommentList()
    this.getSimiMvs()
  },
  methods: {
    getMvDetailInfo() {
      this.$http.get('/mv/detail',{params:{mvid: this.curMvId}}).then(res=>{
        this.mvDetailInfo = res.data
      })
    },
    getMvUrl() {
      this.$http.get('/mv/url',{params:{id:this.curMvId}}).then(res=>{
        this.mvUrl = res.data.data.url
      })
    },
    getMvCommentList() {
      this.$http.get('comment/mv',{params:this.queryInfo}).then(res=>{
        this.mvCommentList = res.data.comments
        this.commentTotal = res.data.total
        this.mvHotComment = res.data.hotComments
      })
    },
    getSimiMvs() {
      this.$http.get('simi/mv',{params:{mvid:this.curMvId}}).then(res=>{
        this.simiMvList = res.data.mvs
      })
    },
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getMvCommentList()
    },
    toMvPage(mvId) {
      this.$router.push('/toVideoPage/' + mvId)
      document.location.reload()
    }
  }
}
</script>