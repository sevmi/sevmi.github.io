<template>
  <div class="container" v-on:mousemove="hasMoved = true">
    <div class="columns">
      <div v-if="hasLogin" class="column col-4 col-sm-12 col-mx-auto mw-300">
        <Navbar :setLogin="setLogin" />
        <router-view></router-view>
      </div>
      <div v-else class="column col-4 col-sm-12 col-mx-auto mw-300">
        <Login :setLogin="setLogin" />
      </div>
    </div>
  </div>
</template>

<script>
const Login = () => import('./views/pre/login/Login.vue')
const Navbar = () => import('./views/Navbar.vue')
import Storage from "@/components/Storage"

export default {
  name: 'app',
  components: {
    Login, 
    Navbar
  },
  data () {
    return {
      hasLogin: false,
    }
  },
  mounted(){
    if(this.$parsemi.current()){
      this.setLogin(true);
    }
  },
  methods: {
    afterSchedule(data){
      Storage.saveTemp('schedules', data);
      this.hasLogin = true;
      this.$router.push('/home');
    },
    setLogin(state){
      if(state){
        if(Storage.getJSON("myRoom") || !this.$parsemi.isPos('Siswa')){
          if(this.$parsemi.isPos('Siswa')){
            const room = Storage.getJSON("myRoom");
            this.$parsemi.roomSchedule(this.afterSchedule, room.objectId);
          } else {
            this.$parsemi.schedules(this.afterSchedule);
          }
        }
        else
          this.$parsemi.myRoom(this.afterRoom);
      }
      else{
        this.hasLogin = false;
      }
    },
    afterRoom(data){
      if(data){
        Storage.saveJSON("myRoom", data);
        this.$parsemi.roomSchedule(this.afterSchedule, data.objectId);
      }
    }
  }
}
</script>

<style>

</style>