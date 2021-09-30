<template>
<div>
  <p>{{briefDesc}}</p>
  <div v-for="(item,index) in singerDesc" :key="index">
    <h4>{{item.ti}}</h4>
    <span v-html="item.txt"></span>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      singerId: this.$route.params.id,
      briefDesc: '',
      singerDesc: []
    }
  },
  created() {
    this.getSingerDesc()
  },
  methods: {
    getSingerDesc() {
      this.$http.get('artist/desc', {params:{id:this.singerId}}).then(res=>{
        this.briefDesc = res.data.briefDesc
        this.singerDesc = res.data.introduction
        this.singerDesc.forEach(item => {
          item.txt = item.txt.replace(/▪/g,'<br/>▪')
        });
      })
    }
  }
}
</script>

<style lang="less" scoped>
p,span{
  font-size: 14px;
}
</style>