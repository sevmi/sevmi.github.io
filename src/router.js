const Home = () => import('./views/home/Home.vue')
const Schedule = () => import('./views/presence/schedule/Schedule.vue')
const Presence = () => import('./views/presence/presence/Presence.vue')
const History = () =>import('./views/presence/history/History.vue')
const Message = () =>import('./views/menu/Message.vue')
// const Tokenize = () =>import('./views/menu/Tokenize.vue')

export default [
  {
    path: '/',
    name: 'Dashboard',
    component: Home,
    isShow: false,
  },
  {
    path: '/home',
    component: Home,
    name: 'Home',
    isShow: true,
  },
  {
    path: '/presence',
    component: Presence,
    name: 'Presensi',
    isShow: true,
  },
  {
    path: '/schedule',
    component: Schedule,
    name: 'Jadwal',
    isShow: true,
  },
  {
    path: '/history',
    component: History,
    name: 'Log',
    isShow: true,
  },
  {
    path: '/message',
    component: Message,
    name: 'Message',
    isShow: true,
  }
]