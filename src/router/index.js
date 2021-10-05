import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main'
import FindMusic from '../components/findMusic/diyRecommend/FindMusic'
import DiyRecommend from '../components/findMusic/diyRecommend/DiyRecommend'
import SongList from '../components/findMusic/diyRecommend/SongList'
import MusicListTable from '../components/findMusic/diyRecommend/MusicListTable'
import CommentPage from '../components/findMusic/diyRecommend/CommentPage'
import VideoPage from '../components/findMusic/diyRecommend/VideoPage'
import MusicListPage from '../components/findMusic/musiclist/MusicListPage'
import MusicRank from '../components/findMusic/rank/MusicRank'
import SingerListPage from '../components/findMusic/singer/SingerListPage'
import SingerDetail from '../components/findMusic/singer/SingerDetail'
import SingerAlbum from '../components/findMusic/singer/SingerAlbum'
import SingerMv from '../components/findMusic/singer/SingerMv'
import SingerDesc from '../components/findMusic/singer/SingerDesc'
import NewMusic from '../components/findMusic/newMusic/NewMusic'
import PlayMusicDetailPage from '../components/findMusic/PlayMusicPage/PlayMusicDetailPage'
import Video from "../components/findMusic/video/Video"
import VideoListTable from '../components/findMusic/video/VideoListTable'
import VideoPlayPage from '../components/findMusic/video/VideoListPage'
import MvListTable from '../components/findMusic/video/MvListTable'
import SearchPage from "../components/findMusic/search/SearchPage"
import SearchBySong from '../components/findMusic/search/SearchBySong'
import SearchByVideo from '../components/findMusic/search/SearchByVideo'
import SearchBySinger from '../components/findMusic/search/SearchBySinger'
import SearchByPlayList from '../components/findMusic/search/SearchByPlayList'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    redirect: '/findMusic',
    children:[
      // 发现音乐界面
      {
        path: '/findMusic',
        component: FindMusic,
        redirect:'/diyRecommend',
        children: [
          {path:'/diyRecommend',component:DiyRecommend},
          {path:'/musicListPage',component:MusicListPage},
          {path:'/musicRank',component:MusicRank},
          {path:'/singerList',component:SingerListPage},
          {path:'/newMusicList',component:NewMusic},
        ]
      },
      // 跳转mv
      {
        path: '/toVideoPage/:id',
        component: VideoPage
      },
      // 跳转歌手详情
      {
        path: '/singer/:id',
        component: SingerDetail,
        redirect: '/album/:id',
        children:[
          {
            path: '/album/:id',
            component: SingerAlbum
          },
          {
            path: '/singerMv/:id',
            component: SingerMv
          },
          {
            path: '/singerDesc/:id',
            component: SingerDesc
          }
        ]
      },
      {
        path: 'musicDetail/:id',
        component: PlayMusicDetailPage
      },
      // 视频模块
      {
        path:'/video',
        component: Video,
        redirect: '/videoPage',
        children: [
          {
            path: '/videoPage',
            component: VideoListTable
          },
          {
            path: '/mvPage',
            component: MvListTable
          }
        ]
      },
      {
        path: 'videoPlay/:id',
        component: VideoPlayPage
      },
      // 搜索结果页面
      {
        path: '/search/:data',
        component: SearchPage,
        children: [
          {
            path: '/searchBySong/:data',
            component: SearchBySong
          },
          {
            path: '/searchBySinger/:data',
            component: SearchBySinger
          },
          {
            path: '/searchByVideo/:data',
            component: SearchByVideo
          },
          {
            path: '/searchByPlayList/:data',
            component: SearchByPlayList
          }
        ]
      },
      // 歌单页面
      {
        path: 'songlist/:id',
        component: SongList,
        children: [
          {
            name: 'musicPage',
            path: '/musicPage',
            component: MusicListTable
          },
          {
            path: '/comment/:id',
            component: CommentPage
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
