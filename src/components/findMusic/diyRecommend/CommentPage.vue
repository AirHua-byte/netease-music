<template>
  <el-container>
    <el-header height='180px;'>
      <div style="background-color:rgb(240,240,242);height:130px;margin-top:25px;border-radius:5px;">
        <el-input
          v-model="comment"
          type="text"
          show-word-limit
          maxlength="120"
          size="medium"
          style="display:inline-block;width:98%;margin:15px 15px;"
        >
        </el-input>
        <el-button size="mini" style="float:right;margin-right:14px;" @click="sendComment">评论</el-button>
      </div>
    </el-header>

    <el-main style="margin-top:25px;margin-bottom:35px;">
      <h4 style="font-weight:300" v-if="queryInfo.offset === 0">精彩评论</h4>

      <div>
        <div v-for="(item,index) in hotCommentList" :key='index'
          style="position:relative;border-top:2px solid rgb(240,240,242);border-bottom:1px solid rgb(240,240,242);padding:15px 0;font-size:15px;"
        >
          <div>
            <img :src="item.user.avatarUrl" alt="" style="display:inline;width:50px;height:50px;border-radius:25px;">
            <div style="margin-left:60px;margin-top:-60px;">
              <p style="font-size:14px;"><span style="color:#4d99de;">{{item.user.nickname}}</span>: {{item.content}}</p>
              <br v-if='item.beReplied.length > 0'>
              <div v-if="item.beReplied.length > 0" style="background-color:rgb(241,241,244);padding:5px 5px;">
                <p v-for="(citem,idx) in item.beReplied" :key="idx" style="font-size:14px;"><span style="color:#4d99de;">{{citem.user.nickname}}</span>: {{citem.content}}</p>
              </div>
              <p style="display:block;font-size:13px;color:gray;font-size:14px;opacity:0.7">{{item.time | dateFormat}}</p>
            </div>
          </div>
        </div>
      </div>

      <h4 style="font-weight:300;margin-top:25px;">最新评论({{total}})</h4>

      <div v-for="(item,index) in commentList" :key="index"
        style="position:relative;border-top:2px solid rgb(240,240,242);border-bottom:1px solid rgb(240,240,242);padding:15px 0;font-size:15px;"
      >
        <div>
          <img :src="item.user.avatarUrl" alt="" style="display:inline-block;width:50px;height:50px;border-radius:50%;">
          <div style="margin-left:60px;margin-top:-60px;">
            <p style="font-size:14px;"><span style="color: #4d99de">{{item.user.nickname}}</span>: {{item.content}}</p>
            <br v-if="item.beReplied.length > 0">
            <div v-if="item.beReplied.length > 0" style="background-color:rgb(241,241,244);padding:5px 5px;">
              <p v-for="(citem,idx) in item.beReplied" :key="idx" style="font-size:14px;"><span style="color:#4d99de;">@{{citem.user.nickname}}</span>: {{citem.content}}</p>
            </div>
            <p style="display:block;font-size:13px;color:gray;font-size:14px;opacity:0.7">{{item.time | dateFormat}}</p>
          </div>
        </div>
      </div>

      <el-pagination
        layout="prev,pager,next"
        :page-size='queryInfo.limit'
        :total='total'
        @current-change='handleCurrentChange'>
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        id: this.$route.params.id,
        limit: 100,
        offset: 0,
      },
      currentId: this.$route.params.id,
      commentList: [],
      hotCommentList: [],
      total: 0,
      comment: ''
    }
  },
  created() {
    this.getCommentList()
  },
  methods:{
    getCommentList(){
      this.$http.get('comment/playlist',{params:this.queryInfo}).then(res=>{
        if(res.data.code === 200){
          this.commentList = res.data.comments
          this.hotCommentList = res.data.hotComments
          this.total = res.data.total
        }
      })
    },
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getCommentList()
    },
    sendComment() {
      this.$http.get('comment',{
        params: {
          t: 1,
          type: 2,
          id: this.currentId,
          content: this.comment
        }
      }).then(res=>{
        if(res.data.code === 200){
          this.getCommentList()
          this.$message.success('评论成功，数据同步可能会耗时！')
        }
      }).catch(err=>{
        console.log(err)
        this.$message.error('用户未登录或遇未知错误')
      })
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .el-input--medium .el-input__inner {
  height: 60px !important;
}
</style>