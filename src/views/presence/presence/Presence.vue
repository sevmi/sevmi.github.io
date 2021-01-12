<template src="./presence.html" />
<style scoped>
.card-header {
  background-position: center;
  text-shadow: 1px 1px #000000;
  color: #ffffff;
  padding-bottom: 10px !important;
}
.btn-float-right {
  position: absolute;
  top: 30px;
  right: 20px;
}
.tile {
  margin-bottom: 10px;
}
.ml-10{
  margin-left: 10px;
}
</style>

<script>
  import iBgCardO from "@/assets/bg-edu-overlay.jpg"
  import Storage from "@/components/Storage"
  const Tokenize = () => import("@/components/Tokenize")
  const TilePresence = () => import("@/components/tile/TilePresence")
  const Message = () => import("@/components/Message")

  export default {
    name: 'PresencePage',
    components: {
      Tokenize, TilePresence, Message
    },
    data () {
    return {
      isPresence: false,
      iBgCardO: iBgCardO,
      schedule: null,
      room: null,
      loaded: false,
      uIndex: null,
      isMessage: false,
      messages: [],
      isGuru: this.$parsemi.isPos('Guru'),
    }},
    mounted(){
      const schedule = Storage.getTemp('schedule');
      this.schedule = schedule;
      const room = Storage.getTemp("room"+this.schedule.room.objectId);
      if(room){
        this.room = room;
        this.$parsemi.presences(this.schedule.objectId, this.fetchPresence);
      } else {
        this.$parsemi.room(schedule.room.objectId, this.fetchRoom);
      }
      if(this.isGuru){
        this.subscribe();
      } else {
        this.isMessage = true;
      }
    },
    methods: {
      clickMessage(){
        this.isMessage = !this.isMessage;
      },
      updateUser(user, index){
        let room = {...this.room};
        room.users[index] = user;
        this.room = room;
      },
      onLogin(){
        this.setLogin(true);
      },
      fetchRoom(d){
        Storage.saveTemp("room"+this.schedule.room.objectId, d);
        this.room = d;
        this.$parsemi.presences(this.schedule.objectId, this.fetchPresence);
      },
      fetchPresence(d){
        let room = {...this.room};
        for (var i = 0; i < room.users.length; i++) {
          let user = room.users[i];
          if(d.length > 0){
            const p = d.find(item => item.get('owner').id == user.objectId);
            if(p){
              user.presence = p;
            }
          }
        }
        this.room = room;
        this.loaded = true;
        this.$parsemi.messages(this.afterMessage, this.schedule.objectId);
      },
      afterMessage(data){
        this.messages = data;
      },
      subscribe(){
        const schedule = {__type:'Pointer',className:'Schedule',objectId: this.schedule.objectId};
        this.$parsemi.subsrcibe(this.onSubscribe, "Presence", "schedule", schedule)
      },
      onSubscribe(data){
        data.on('create', this.settleWithoutIndex);
        data.on('update', this.settleWithoutIndex);
      },
      settleWithoutIndex(data){
        let room = {...this.room};
        let user = room.users.find(item=>item.objectId == data.get('owner').id);
        if(user){
          user.presence = data;
          this.room = room;
          this.uIndex = data.get('owner').id;
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$parsemi.unsubscribe();
      next();
    }
  }
</script>
