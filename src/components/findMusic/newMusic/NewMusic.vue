<template>
  <el-row style="margin-top: 25px;">

    <el-col
      :span='20'
      :offset="2"
    >
      <p>
        语种：
        <span
          id='types'
          v-for="(item, index) in musicType" 
          :key="index"
          @click="changeType(item.type)"
          :class="index === 0 ? 'isActive' : 'types' + item.type"
          style="margin-left:25px;cursor:pointer;"
        >
          {{item.name}}
        </span>
      </p>
    
      <el-table
        :data='newMusicInfo'
        stripe
        :show-header="false"
      >
        <el-table-column type="index">
          <template scope="scope">
            {{scope.$index+1 >= 10 ? scope.$index+1 : '0' + (scope.$index+1).toString()}}
          </template>
        </el-table-column>
        <el-table-column>
          <template scope="scope">
            <i 
              class="el-icon-video-play" 
              @click="changeNewUrl(scope.row.id)"
              style="position:absolute;font-size:25px;top:35px;left:35px;z-index:8;cursor:pointer;"
            >
            </i>
            <el-image 
              :src='scope.row.album.picUrl'
              @click="changeNewurl(scope.row.id)"
              style="width:75px;height:75px;cursor:pointer"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name">
        </el-table-column>
        <el-table-column prop="album.name">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 0
      },
      musicType: [
        {
          type: 0,
          name: '全部'
        },
        {
          type: 7,
          name: '华语'
        },
        {
          type: 96,
          name: '欧美'
        },
        {
          type: 16,
          name: '韩国'
        },
        {
          type: 8,
          name: '日本'
        }
      ],
      newMusicInfo: [
        {
          id: 0,
          album: {
            picUrl: ''
          }
        }
      ],
      prevType: 'type' + 0
    }
  },
  created() {
    this.getNewMusic()
  },
  methods: {
    getNewMusic() {
      this.$http.get('top/song',{params:this.queryInfo}).then(res=>{
        this.newMusicInfo = res.data.data
      })
    },
    changeType(typeId){
      this.$('.isActive').eq(0).attr('class',this.prevType)
      this.$('.types'+typeId).eq(0).attr('class','isActive')
      this.prevType = 'types' + typeId
      this.getNewMusic()
    },
    changeNewUrl(musicId){
      var playlist = []
      this.newMusicInfo.forEach(item => {
        playlist.push(item.id)
      })
      this.$emit('setSongListInfo',playlist,musicId)
    }
  }
}
</script>

<style lang="less" scoped>
.isActive{
  color: red;
}
</style>