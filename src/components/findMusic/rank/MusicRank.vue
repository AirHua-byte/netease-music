<template>
  <div style="margin-bottom:55px;">
    <el-row>
      <div  style="border-bottom:2px solid rgb(230,230,230)">
        <p style="margin-bottom: 10px;font-size: 22px;">官方榜</p>
      </div>
      <el-col :span='18' :offset="3">
        <el-row style="margin-top:25px;" v-for="(item,index) in 4" :key="index">
          <el-col :span='6'>
            <el-image
              :src='musicRankList[item-1].coverImgUrl'
              @click="toSongListPage(musicRankList[item - 1].id)"
              style="height: 200px;border-radius:15px;cursor:pointer;"
            >
            </el-image>
          </el-col>
          <el-col :span='18'>
            <el-table
              :data='musicRankList[item - 1].tracks'
              @row-dbclick='playMusicList'
              stripe
              :show-header="false"
              style="margin:15px 0;"
            >
              <el-table-column type="index">
                <template scope="scope">
                  <span style="color: red;font-weight:400">{{scope.$index+1}}</span>
                </template>
              </el-table-column>
              <el-table-column>
                <template scope="scope">
                  <span>{{scope.row.first}}</span>
                </template>
              </el-table-column>
              <el-table-column>
                <template scope="scope">
                  <span>{{scope.row.second}}</span>
                </template>
              </el-table-column>
            </el-table>
            <span style="font-size:14px;cursor:pointer;" @click="toSongListPage(musicRankList[item - 1].id)">查看全部 ></span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <div  style="border-bottom:2px solid rgb(230,230,230)">
        <p style="margin-bottom: 10px;font-size: 22px;">全球榜</p>
      </div>

      <el-row :gutter="10">
        <el-col 
          :span='4'
          v-for="(item, index) in musicRankList.slice(4)" 
          :key="index"
          style="margin-top: 20px;position: relative;"
        >
          <div style="background:rgba(128,128,128,0.2);color:white;width:94%;position:absolute;z-index:10;">
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0) + '万' : item.playCount}}
            </div>
          </div>

          <div>
            <el-image
              :src='item.coverImgUrl'
              @click="toSongListPage(item.id)"
              style="box-shadow: 0 0 2px 2px gray;border-radius:10px;cursor:pointer;"
            >
            </el-image>
          </div>
          <h1 @click="toSongListPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicRankList: [
        {
          coverImgUrl: ''
        },
        {
          coverImgUrl: ''
        },
        {
          coverImgUrl: ''
        },
        {
          coverImgUrl: ''
        }
      ],
      singerRankInfo: {
        coverUrl: '',
        artists: []
      }
    }
  },
  created() {
    this.getOfficialRankList()
  },
  methods: {
    async getOfficialRankList() {
      await this.$http.get('toplist/detail').then(res=>{
        console.log(res.data.list)
        this.musicRankList = res.data.list
        console.log(res.data.artistToplist)
        this.singerRankInfo = res.data.artistToplist
      })
    },
    toSongListPage(id){
      this.$router.push('/songlist/' + id)
    },
    playMusicList(row){
      this.emit('setSongListInfo',window.localStorage.getItem('playlist'),row.id)
    }
  }
}
</script>