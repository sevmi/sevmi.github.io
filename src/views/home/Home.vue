<template src="./home.html" />

<style scoped>
  .tile {
    margin-bottom: 10px;
  }
  .avatar {
    background: #ffffff !important;
  }
  .panel-header {
    background-position: center;
    text-shadow: 1px 1px #000000;
    color: #ffffff;
    padding-bottom: 10px !important;
    margin-bottom: 10px;
  }
  .anim-left{
    -webkit-animation:linear infinite alternate;
    -webkit-animation-name: run;
    -webkit-animation-duration: 1.5s;
  }     
  @-webkit-keyframes run {
      0% { left: 0;}
      50%{ left : 5%;}
      100%{ left: 0;}
  }
</style>

<script>
  import iUser from "@/assets/user.png"
  import iBgCardO from "@/assets/bg-edu-overlay.jpg"
  import Storage from "@/components/Storage"
  import PresenceList from "@/components/PresenceList"

  export default {
    name: 'HomePage',
    components: {
      PresenceList,
    },
    data () {
    return {
      iUser: iUser,
      iBgCardO: iBgCardO,
      user: this.$parsemi.current(),
      history: [],
      graph: {totalSchedule: 0, Total:0, Tepat:0, Lambat:0},
      scCount:0,
    }},
    mounted(){
      this.getHistory();
      const schedules = Storage.getTemp('schedules');
      if(schedules && schedules.length > 0){
        this.scCount = schedules.length;
      }
    },
    methods: {
      getScheduleCount(){
        this.$parsemi.getAllSchedule(this.afterCount);
      },
      onLogin(){
        this.setLogin(true);
      },
      getHistory(){
        this.$parsemi.getPresences(this.afterHistory);
      },
      calculateGraph(data){
        let totalT = 0;
        let totalL = 0;
        for (var i = 0; i < data.length; i++) {
          const total = data[i].total;
          Object.keys(total).forEach((item)=>{
            if(item == 'Tepat' && total[item] > 0) {
              totalT = totalT + total[item];
            }
            if(item == 'Lambat' && total[item] > 0){
              totalL = totalL + total[item];
            }
          })
        }
        this.graph.Tepat = totalT;
        this.graph.Lambat = totalL;
      },
      getGraph(c=1){
        if(this.graph.totalSchedule <= 0)
          return;
        let p = Math.round(((this.graph.Tepat+this.graph.Lambat)/this.graph.totalSchedule*100)*100)/100;
        if(c == 2)
          p = Math.round(((this.graph.Tepat)/(this.graph.Tepat+this.graph.Lambat)*100)*100)/100;
        return `<div class="bar-item" role="progressbar" style="width:`+p+`%;">`+p+`%</div>`;
      },
      afterHistory(data){
        let totalSchedule = 0;
        for (var i = 0; i < data.length; i++) {
          totalSchedule = totalSchedule + data[i].total.Week;
          // delete data[i].total.Week;
        }
        this.graph.totalSchedule = totalSchedule;
        this.history = data;
        this.calculateGraph(data);
      },
    }
  }
</script>
