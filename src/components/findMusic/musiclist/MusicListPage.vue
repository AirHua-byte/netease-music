<template>
  <el-container style="margin-bottom:55px;">
    <el-header>
      <p>
        热门标签：
        <span 
          id='cats' 
          v-for="(item,index) in hotMusicListTags" 
          :key="index" 
          @click="changeMusicListCat(item.name,index)"
          style="margin-left:25px; cursor:pointer;"
          :class="'cat' + index"
        >
          {{item.name}}
        </span>
      </p>
    </el-header>

    <el-main v-loading="loading">
      <el-row :gutter='10'>
        <el-col
          :span='4'
          v-for="(item, index) in goodMusicList" 
          :key="index"
          style="margin-top: 20px;position:relative;"
        >
          <div style="background: rgba(128,128,128,0.2);color:white;width:85%;position:absolute;z-index:10;">
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{item.playCount > 10000 ? (item.playCount/10000).toFixed(0) + '万' : item.playCount}}
            </div>
          </div>

          <!-- <div style="box-sizing: content-box;">
            <el-image
              :src='item.coverImgUrl'
              @click="toSongListPage(item.id)"
              style="box-shadow: 0 0 2px 2px gray;border-radius:10px;cursor:pointer;width:100%;height:100%"
            >
            </el-image>
          </div> -->

          <div style="padding-bottom: 100%;width: 100%;position: relative;">
            <el-image 
              :src='item.coverImgUrl'
              @click="toSongListPage(item.id)"
              style="box-shadow: 0 0 2px 2px gray;border-radius:10px;cursor:pointer;width: 100%;height: 100%;position: absolute;top: 0;left: 0;  ">
            </el-image>
          </div>

          <h1 @click="toSingListPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>
        </el-col>
      </el-row>

      <el-pagination
        layout="prev,pager,next"
        :page-size='queryInfo.limit'
        :total="goodMusicListTotal"
        @current-change='handleCurrentChange'
      >
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        cat: '全部',
        limit: 24,
        offset: 0,
      },
      hotMusicListTags: [],
      goodMusicList: [],
      goodMusicListTotal: 0,
      prevClickCat: '',
      loading: true
    }
  },
  created() {
    this.getHotMusicListTags()
    this.getGoodMusicList()
  },
  methods: {
    getHotMusicListTags() {
      this.$http.get('playlist/hot').then(res =>{
        this.hotMusicListTags = res.data.tags
      })
    },
    getGoodMusicList() {
      this.$http.get('/top/playlist',{params:this.queryInfo}).then(res=>{
        this.goodMusicList = res.data.playlists
        this.goodMusicListTotal = res.data.total
        this.loading = false
      })
    },
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getGoodMusicList()
    },
    toSongListPage(id) {
      this.$router.push('/songlist/' + id)
    },
    changeMusicListCat(newCat,index) {
      if(this.prevClickCat === 'cat' + index) {
        this.$('.activeCat').eq(0).attr('class',this.prevClickCat)
        this.queryInfo.cat = '全部'
        this.getGoodMusicList()
      }
      this.queryInfo.cat = newCat
      this.$('.activeCat').eq(0).attr('class',this.prevClickCat)
      if(this.prevClickCat !== 'cat' + index){
        this.prevClickCat = 'cat' + index
      }
      this.$('.cat' + index).attr('class','activeCat')
      this.getGoodMusicList()
    }
  }
}
</script>

<style lang="less" scoped>
h1{
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
[class*=el-col-] {
  display: inline-block;
  float: none;
}
#cats:hover {
  color: red;
}
.activeCat{
  color: red;
}
</style>