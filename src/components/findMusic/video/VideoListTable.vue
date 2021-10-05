<template>
  <el-row style="margin-bottom: 150px;">
    <el-col :span='18' :offset="3">
      <el-button @click="showTagDialog">全部分类</el-button>

      <el-dialog 
        title="全部标签" 
        :visible.sync='tagDialogTableVisible' 
        :modal='false'
        style="position:absolte;left:-15%;top:7%;"
      >
        <el-scrollbar style="height:400px;">
          <div class="tags">
            <el-tag
              v-for="(item, index) in tags" 
              :key="index"
              @click="changeTag(item.id)"
              class="tag"
              :style="item.id === queryInfo.id ? 'color:red' : 'blue'"
            >
              {{item.name}}
            </el-tag>
          </div>
        </el-scrollbar>
      </el-dialog>

      <el-row :gutter='20' v-loading="loading">
        <el-col 
          :span='6'
          v-for="(item, index) in videoList" 
          :key="index"
          style="margin-top: 20px;position: relative;"
        >
          <div style="background: rgba(128,128,128,0.2);color:white;width:93%;position:absolute;z-index:10;">
            <div style="float: right">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{item.data.playTime >= 10000 ? (item.data.playTime/10000).toFixed(0) + '万' : item.data.playTime }}
            </div>
          </div>

          <div style="position:relative;width:100%;padding-bottom:56%;">
            <el-image
              :src='item.data.coverUrl'
              @click="toVideoPage(item.data.vid)"
              style="box-shadow: 0 0 2px 2px gray;border-radius:10px;cursor:pointer;width:100%;height:100%;position:absolute;top:0;left:0;"
            >
            </el-image>
          </div>

          <h1 @click="toVideoPage(item.data.vid)" style="cursor:pointer;">{{item.data.title}}</h1>
        </el-col>
      </el-row>

      <el-pagination
        layout="prev,next"
        @current-change='handleCurrentChange'
      >
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      tags: [],
      tagDialogTableVisible: false,
      queryInfo: {
        id: 58100,
        offset: 0
      },
      videoList: [
        {
          data: {
            title: ''
          }
        }
      ],
      loading: true
    }
  },
  created() {
    this.getVideoTags()
    this.getVideoList()
  },
  methods: {
    getVideoTags() {
      this.$http.get('video/group/list').then(res => {
        this.tags = res.data.data
      })
    },
    showTagDialog() {
      this.tagDialogTableVisible = true
    },
    getVideoList() {
      if (window.localStorage.getItem('currentUserInfo') === 'null') {
        return this.$message.error('需要登录获取视频数据！')
      }
      this.$http.get('video/group',{params:this.queryInfo}).then(res=>{
        this.videoList = res.data.datas
        this.loading = false
      })
    },
    toVideoPage(id) {
      console.log(id)
      this.$router.push('videoPlay/'+id)
    },
    handleCurrentChange(newPage) {
      this.queryInfo.offset += 8
      this.getVideoList()
    },
    changeTag(tagId) {
      this.queryInfo.id = tagId
      this.getVideoList()
      this.tagDialogTableVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  width: 30%;
  height: 500px;
  overflow-y: hidden;
}
h1{
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tags{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.tag{
  width: 100px;
  margin-top: 5px;
  cursor: pointer;
  background-color: white;
  text-align: center;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
::v-deep .el-tag {
  border: 0;
}
</style>