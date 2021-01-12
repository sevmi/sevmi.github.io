<template>
  <div v-if="isAvailable" class="columns" style="border: .05rem solid #dadee4;">
    <header class="navbar" style="width: 100%">
      <section class="navbar-section">
        <router-link to="/home" class="btn btn-link">Home</router-link>
        <router-link v-if="scCount > 0" to="/schedule" class="btn btn-link">Jadwal</router-link>
        <router-link to="/history" class="btn btn-link">Log</router-link>
        <div v-if="$parsemi.isPos('Kepala Sekolah')" class="dropdown">
          <button class="btn btn-link dropdown-toggle" tabindex="0">
            Menu <i class="icon icon-caret"></i>
          </button>
          <ul v-if="$parsemi.isPos('Kepala Sekolah')" class="menu">
            <li class="menu-item">
              <router-link to="/message">Message</router-link>
            </li>
          </ul>
        </div>
      </section>
      <section class="navbar-section">
        <button @click="onLogout" class="btn btn-error input-group-btn"><i class="icon icon-shutdown"></i></button>
      </section>
    </header>
  </div>
</template>

<script>
  import Storage from "@/components/Storage"
  export default {
    name: 'NavbarPage',
    props: ["setLogin"],
    mounted(){
      const schedules = Storage.getTemp('schedules');
      if(schedules && schedules.length > 0){
        this.scCount = schedules.length;
      }
    },
    watch: {
      '$route' (to) {
        if(to.name == 'Home')
          this.isAvailable = true;
        else
          this.isAvailable = false;
      }
    },
    data(){
      return {
        scCount: 0,
        isAvailable: true,
      }
    },
    methods: {
      onLogout(){
        this.$parsemi.logOut(this.afterLogOut);
      },
      afterLogOut(){
        this.setLogin(false);
        this.$router.push('/');
      }
    }
  }
</script>

<style scoped>

</style>