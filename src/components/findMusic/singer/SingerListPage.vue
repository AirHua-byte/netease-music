<template>
  <el-container style="margin-bottom:55px;">
    <el-header style="height:80px;">
      <p>
        语种：
        <span 
          id='areas'
          v-for="(item, index) in singerLanguage" 
          :key="index"
          :class="index === 0 ? 'isActive' : 'area' + item.id"
          @click="changeMusicListTypes(item.id)"
          style="margin-left:25px;cursor:pointer;"
        >
          {{item.name}}
        </span>
      </p>
      <p>
        分类：
        <span
          id='types'
          v-for="(item, index) in singerType" 
          :key="index"
          :class="index === 0 ? 'isActiveByTypes' : 'type' + item.id"
          @click="changeMusicListSex(item.id)"
          style="margin-left:25px;cursor:pointer;"
        >
          {{item.name}}
        </span>
      </p>
    </el-header>

    <el-main v-loading="loading">
      <el-row :gutter="10">
        <el-col 
          :span="4"
          v-for="(item, index) in singerList" 
          :key="index"  
          style="margin-top:20px;position:relative;"
        >
          <div>
            <el-image
              :src='item.img1v1Url'
              @click="toSingerDetailPage(item.id)"
              style="box-shadow: 0 0 2px 2px gray;border-radius:10px;cursor:pointer;"
              @load="overLoad"
            >
            </el-image>
          </div>
          <h1 @click="toSingerDetailPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>
        </el-col>
      </el-row>

      <el-pagination
        background
        layout='prev,next'
        :page-size='queryInfo.limit'
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
      queryInfo:  {
        type: -1,
        area: -1,
        limit: 36,
        offset: 0
      },
      singerType: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '男歌手'
        },
        {
          id: 2,
          name: '女歌手'
        },
        {
          id: 3,
          name: '乐队'
        }
      ],
      singerLanguage: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 7,
          name: '华语'
        },
        {
          id: 96,
          name: '欧美'
        },
        {
          id: 8,
          name: '日本'
        },
        {
          id: 16,
          name: '韩国'
        },
        {
          id: 0,
          name: '其他'
        }
      ],
      singerList: [],
      prevClickArea: 'area-1',
      prevClickType: 'type-1',
      loading: true
    }
  },
  created() {
    this.getSingerList()
  },
  methods: {
    async getSingerList() {
      await this.$http.get('artist/list',{params: this.queryInfo}).then(res=>{
        this.singerList = res.data.artists
      })
    },
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo
    },
    changeMusicListTypes(areaId) {
      this.$('.isActive').eq(0).attr('class',this.prevClickArea)
      this.$('.area' + areaId).eq(0).attr('class','isActive')
      this.prevClickArea = 'area' + areaId
      this.queryInfo.area = areaId
      this.getSingerList()
    },
    changeMusicListSex(typeId) {
      this.$('.isActiveByTypes').eq(0).attr('class',this.prevClickType)
      this.$('.type'+typeId).eq(0).attr('class','isActiveByTypes')
      this.prevClickType = 'type' + typeId
      this.queryInfo.type = typeId
      this.getSingerList()
    },
    toSingerDetailPage(id) {
      this.$router.push('/singer/' + id)
    },
    overLoad() {
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
#types:hover, #areas:hover {
  color: red;
}

.isActive, .isActiveByTypes {
  color: red;
}
</style>