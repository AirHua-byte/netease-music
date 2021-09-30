<template>
  <el-container :key='this.$route.params.data'>
    <el-header style="border-bottom:1px solid rgb(230,230,230)" height="150px;">
      <el-menu :default-active="/searchBySong/+`${this.$route.params.data}`" :router="true" mode="horizontal" style="margin:0 auto;width:420px;">
        <el-menu-item :index='/searchBySong/+`${this.$route.params.data}`' ref='songClick'>单曲</el-menu-item>
        <el-menu-item :index="/searchBySinger/+`${this.$route.params.data}`">歌手</el-menu-item>
        <el-menu-item :index="/searchByVideo/+`${this.$route.params.data}`">视频</el-menu-item>
        <el-menu-item :index="/searchByPlayList/+`${this.$route.params.data}`">歌单</el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <router-view ref="child" @setMusicUrl='setMusicUrl'></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      searchData: decodeURIComponent(this.$route.params.data)
    }
  },
  created() {
    this.toSingSearchPage()
  },
  methods:{
    toSingSearchPage() {
      this.searchData = this.$route.params.data
      const href = window.location.href
      if (href.substring(href.indexOf('#/')+1,href.length) === '/search/' + encodeURIComponent(this.$route.params.data)){
        this.$router.push('/searchBySong/' + decodeURIComponent(this.$route.params.data))
      }
    },
    setMusicUrl(url,detail){
      this.$emit('setMusicUrl',url,detail)
    }
  }
}
</script>

<style lang="less" scoped>
.topBar{
  margin: 0 auto;
  width: 700px;
  span{
    margin-left: 40px;
    cursor: pointer;
  }
  span:hover{
    color: red;
  }
  span:visited{
    border-bottom: 1px solid red;
  }
}
.el-menu--horizontal.el-menu{
  border-bottom: 0px;
}
.el-menu-item.is-active{
  color: black;
  border-bottom: 2px solid red !important;
}
</style>