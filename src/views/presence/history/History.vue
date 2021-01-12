<template src="./history.html"></template>

<script>
  import Storage from "@/components/Storage"
  const PresenceList = () => import("@/components/PresenceList")
  const Chart = () => import("@/components/Chart")

  let timeO;
  let maxSigma = 0;

  export default {
    name: 'HistoryPage',
    components: {
      PresenceList, Chart
    },
    data () {
    return {
      form: {position: 0, room: 0, schedule: 0, dMonth: "2020-04"},
      isShow: {room: false, schedule: false},
      allSchedule: [],
      presences: [],
      bySchedule: false,
      rooms: [],
      teachers: [],
      isByAll: false,
      totalData: null,
      sigmaData: null,
      chartData: {Week:0, Total: 0, Tepat: 0, Lambat: 0, Alpa: 0, Izin: 0, Dispen: 0, Sakit: 0},
      refer: 'Total'
    }},
    methods: {
      byAll(){
        timeO = setTimeout(this.calculateByAll, 100);
      },
      calculateByAll(){
        if(timeO)
          clearTimeout(timeO);
        let users;
        if(this.form.position == 'Kepala Sekolah')
          users = this.teachers;
        else
          users = this.rooms[this.form.room-1].users;
        if(this.isByAll){
          this.convertPresenceByAll(users);
        } else {
          this.convertPresence(users);
        }
      },
      onSubmit(){
        // teacher and all schedule
        if(this.isShow.schedule && this.form.schedule == 0) {
          let schedules = [];
          for (var i = 0; i < this.allSchedule.length; i++) {
            const s = {__type:'Pointer',className:'Schedule', objectId:this.allSchedule[i].objectId};
            schedules.push(s);
          }
          this.$parsemi.presenceMultiSchedules(schedules, this.afterGetPresence, this.form.dMonth, true);
        } else if(this.isShow.schedule && this.form.schedule > 0) {
          const schedule = this.allSchedule[this.form.schedule-1];
          this.$parsemi.presences(schedule.objectId, this.afterPresence, "owner", true);
        } else if(this.form.position == 'Siswa') {
          this.$parsemi.getPresences(this.afterPresences);
        } else if(this.form.position == 'Wali Kelas' && this.form.room > 0){
          //get presence based on user with aggregate
          let inUser = [];
          const users = this.rooms[this.form.room-1].users;
          for (var j = 0; j < users.length; j++) {
            inUser.push("_User$"+users[j].objectId);
          }
          this.$parsemi.getPresenceUsersTotal(this.afterGetTotal, this.form.dMonth, inUser);
        } else if(this.form.position == 'Bendahara' || this.form.position == 'Kepala Sekolah') {
          const teachers = Storage.getTemp('teachers');
          if(teachers){
            this.afterTeacher(teachers, true);
          } else {
            this.$parsemi.getUsers(this.afterTeacher, "position", ["Guru"]);
          }

        } else {
          this.$dialog.alert({title: "Informasi", body: "Pastikan semua field terisi dengan benar"}, {okText: "Ok"});
        }
      },
      afterTeacher(data, hasSave=false){
        let inUser = [];
        this.teachers = data;
        if(!hasSave){
          Storage.saveTemp('teachers', data)
        }
        for (var j = 0; j < data.length; j++) {
          inUser.push("_User$"+data[j].objectId);
        }
        this.$parsemi.PresenceUsersTotalWithSchedule(this.PresenceUsersTotalWithSchedule, this.form.dMonth, inUser);
      },
      PresenceUsersTotalWithSchedule(data){
        const users = this.teachers;
        this.totalData = data;
        let strData = JSON.stringify(data);
        this.sigmaData = JSON.parse(strData);
        this.convertPresence(users);
      },
      afterGetTotal(data){
        this.totalData = data;
        let strData = JSON.stringify(data);
        this.sigmaData = JSON.parse(strData);
        const users = this.rooms[this.form.room-1].users;
        this.convertPresence(users);
      },
      resetTotal(){
        this.chartData = {Week:0, Total: 0, Tepat: 0, Lambat: 0, Alpa: 0, Izin: 0, Dispen: 0, Sakit: 0};
      },
      sumTotal(chartData, total){
        if(total){
          Object.keys(chartData).forEach((key)=>{
            chartData[key] += total[key];
          });
        }
        return chartData;
      },
      convertPresence(users){
        let presences = [];
        let chartData = {...this.chartData};
        if(this.form.position == 'Kepala Sekolah')
          chartData.Kosong = 0;
        for (var i = 0; i < users.length; i++) {
          let d = this.totalData.find(d=>d.objectId == users[i].objectId);
          if(d){
            if(d.Week > 0)
              d.Kosong = d.Week - d.Total;
            let presence = {
              owner: users[i],
              total: d,
            }
            if(this.form.position == 'Kepala Sekolah'){
              if(d.Jadwal > 0)
                presences.push(presence);
            } else {
              presences.push(presence);
            }
            chartData = this.sumTotal(chartData, d);
            // Save max sigma
            if(d.Week > maxSigma)
              maxSigma = d.Week;
          }
        }
        if(this.form.position == 'Kepala Sekolah') {
          this.refer = 'Week';
        } else {
          this.refer = 'Total';
          delete chartData['Kosong'];
        }
        this.chartData = chartData;
        this.bySchedule = true;
        this.presences = presences;
      },
      convertPresenceByAll(users){
        let presences = [];
        let chartData = {...this.chartData};
        for (var i = 0; i < users.length; i++) {
          let d = this.sigmaData.find(d=>d.objectId == users[i].objectId);
          chartData = this.sumTotal(chartData, d);
          if(d){
            d.Week = maxSigma;
            d.Kosong = maxSigma - d.Total;
            let presence = {
              owner: users[i],
              total: d,
            }
            if(this.form.position == 'Kepala Sekolah'){
              if(d.Jadwal > 0)
                presences.push(presence);
            } else {
              presences.push(presence);
            }
          }
        }
        this.refer = 'Week';
        // calculate Kosong
        chartData.Kosong = chartData.Week - chartData.Total;
        this.chartData = chartData;
        this.bySchedule = true;
        this.presences = presences;
      },
      changeRoom(){
        this.totalData = null;
        this.sigmaData = null;
        this.presences = [];
        this.isByAll = false;
        maxSigma = 0;
        this.resetTotal();
      },
      afterPresences(data){
        this.presences = data;
      },
      afterPresence(data){
        this.bySchedule = true;
        this.presences = data;
      },
      afterGetPresence(data){
        this.bySchedule = false;
        this.presences = data;
      },
      onPosition(){
        this.presences = [];
        if(this.form.position == 'Guru'){
          const allSchedule = Storage.getTemp("allSchedule"+this.form.dMonth);
          if(allSchedule){
            this.isShow.schedule = true;
            this.allSchedule = allSchedule;
          } else {
            this.$parsemi.getAllSchedule(this.afterAllSchedule, null, true);
          }
        } else {
          this.isShow.schedule = false;
        }
        if(this.form.position == 'Wali Kelas'){
          this.isShow.room = true;
          if(this.rooms && this.rooms.length == 0){
            const rooms = Storage.getTemp('rooms');
            if(rooms){
              this.rooms = rooms;
            } else {
              this.$parsemi.rooms(this.afterRooms);
            }
          }
        } else {
          this.isShow.room = false;
        }
        this.changeRoom();
      },
      afterAllSchedule(data){
        Storage.saveTemp("allSchedule"+this.form.dMonth, data);
        this.isShow.schedule = true;
        this.allSchedule = data;
      },
      afterRooms(data){
        this.rooms = data;
        Storage.saveTemp('rooms', data);
      }
    },
  }
</script>

<style scoped>
  
</style>