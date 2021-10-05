<template>
  <el-row style="margin-bottom:150px;">
    <el-col :span="18" :offset="3">
      <p>
        地区：
        <span 
          id='areas'
          v-for="(item, index) in areas" 
          :key="index"
          :class="index===0 ? 'isActive' : 'area' + item.id"
          @click="changeAreas(item.id, item.name)"
          style="margin-left:25px; cursor:pointer;"
        >
          {{item.name}}
        </span>
      </p>
      <p>
        分类：
        <span
          id='types'
          v-for="(item, index) in types" 
          :key="index"
          :class="index===0 ? 'isActiveByTypes' : 'type' + item.id"
          @click="changeTypes(item.id,item.name)"
          style="margin-left:25px;cursor:pointer;"
        >
          {{item.name}}
        </span>
      </p>
      <p>
        排序：
        <span
          id='orders'
          v-for="(item, index) in order" 
          :key="index"
          :class="index===0 ? 'isActiveByOrder' : 'order' + item.id"
          @click="changeOrder(item.id,item.name)"
          style="margin-left:25px;cursor:pointer;"
        >
          {{item.name}}
        </span>
      </p>

      <el-row style="margin-top:25px;" :gutter="20" v-loading="loading">
        <el-col
          :span='6'
          v-for="(item, index) in mvList" :key="index"
          style="margin-top:20px;position:relative;"
        >
          <div style="padding-bottom:56%;position:relative;width:100%;">
            <el-image
              :src='item.cover'
              @click="toMvPage(item.id)"
              style="box-shadow:0 0 2px 2px gray;border-radius:10px;cursor:pointer;width:100%;position:absolute;top:0;left:0;"
            >
            </el-image>
          </div>

          <div style="background: rgba(128,128,128,0.2);color:white;width:93%;position:absolute;top:0;z-index:10;">
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right:5px;"></i>
              {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0) + '万' : item.playCount}}
            </div>
          </div>

          <h1 @click="toMvPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>
        </el-col>
      </el-row>

      <el-pagination
        background
        layout='prev,next'
        :page-size="queryInfo.limit"
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
      queryInfo: {
        type: '全部',
        area: '全部',
        order: '上升最快',
        limit: 12,
        offset: 0
      },
      types: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '官方版'
        },
        {
          id: 2,
          name: '原生'
        },
        {
          id: 3,
          name: '现场版'
        },
        {
          id: 4,
          name: '网易出品'
        }
      ],
      areas: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 7,
          name: '内地'
        },
        {
          id: 96,
          name: '港台'
        },
        {
          id: 8,
          name: '欧美'
        },
        {
          id: 16,
          name: '日本'
        },
        {
          id: 0,
          name: '韩国'
        }
      ],
      order: [
        {
          id: 1,
          name: '上升最快'
        },
        {
          id: 2,
          name: '最热'
        },
        {
          id: 3,
          name: '最新'
        }
      ],
      mvList: [],
      prevClickArea: 'area-1',
      prevClickType: 'type-1',
      prevClickOrder: 'order1',
      loading: true
    }
  },
  created() {
    this.getMvList()
  },
  methods: {
    getMvList() {
      this.$http.get('/mv/all',{params:this.queryInfo}).then(res=>{
        this.mvList = res.data.data
        this.loading = false
      })
    },
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getMvList()
    },
    changeAreas(areaId, areaName) {
      this.$('.isActive').eq(0).attr('class',this.prevClickArea)
      this.$('.area' + areaId).eq(0).attr('class','isActive')
      this.prevClickArea = 'area' + areaId
      this.queryInfo.area = areaName
      this.getMvList()
    },
    changeTypes(typeId,typeName) {
      this.$('.isActiveByTypes').eq(0).attr('class',this.prevClickType)
      this.$('.type' + typeId).eq(0).attr('class','isActiveByTypes')
      this.prevClickType = 'type' + typeId
      this.queryInfo.type = typeName
      this.getMvList()
    },
    changeOrder(orderId,orderName) {
      this.$('.isActiveByOrder').eq(0).attr('class',this.prevClickOrder)
      this.$('.order' + orderId).eq(0).attr('class','isActiveByOrder')
      this.prevClickOrder = 'order' + orderId
      this.queryInfo.order = orderName
      this.getMvList()
    },
    toMvPage(id) {
      this.$router.push('/toVideoPage/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
h1{
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#types:hover, #areas:hover, #order:hover {
  color: red;
}
.isActive, .isActiveByTypes, .isActiveByOrder {
  color: red;
}
</style>