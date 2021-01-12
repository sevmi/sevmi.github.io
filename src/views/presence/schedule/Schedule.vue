<template src="./schedule.html" />

<style scoped>
  .head-list {
    margin-bottom: 20px;
    font-size: 25px;
  }
  .tile {
    margin-bottom: 10px;
  }
</style>

<script>
  import iBgCard from "@/assets/bg-edu.jpg"
  import Storage from "@/components/Storage"

  let sto = null;
  let loader = null;

  export default {
    name: 'SchedulePage',
    mounted() {
      const schedules = Storage.getTemp('schedules');
      if(schedules){
        this.schedules = schedules;
        if(schedules.length > 0){
          this.getPresence();
        }
      }
    },
    data () {
    return {
      iBgCard: iBgCard,
      schedules: [],
      user: this.$parsemi.current(),
      cTime: null,
      scheduleIndex: 0,
    }},
    methods: {
      getServerTime(){
        this.$parsemi.serverTime(this.serverTime);
      },
      serverTime(data){
        // make sure we have locally
        this.cTime = this.$parsemi.local(new Date(data));
        if(sto)
          clearTimeout(sto);
        sto = setTimeout(this.getServerTime, 60000);
        this.checkAvailable();
      },
      getTimeString(item){
        const strTime = this.cTime.getFullYear() + "-" + (this.cTime.getMonth()+1) + "-" + this.cTime.getDate() + " ";
        const timeStart = strTime + item.hourStart;
        const timeEnd = strTime + item.hourEnd;
        const st = new Date(timeStart).getTime();
        const et = new Date(timeEnd).getTime();
        const diff = Math.round(((this.cTime.getTime() - st) / 60000)*100)/100;
        const eDiff = Math.round(((et - this.cTime.getTime()) / 60000)*100)/100;
        return {diff: diff, eDiff: eDiff};
      },
      checkAvailable(){
        if(!this.cTime)
          return;
        let allEnd = 0;
        for (var i = 0; i < this.schedules.length; i++) {
          const gts = this.getTimeString(this.schedules[i]);
          const diff = gts.diff;
          const eDiff = gts.eDiff;
          if(diff >= 0 && eDiff > 0){
            this.schedules[i].isAvailable = true;
          } else {
            this.schedules[i].isAvailable = false;
          }
          if(eDiff <=0 ){
            allEnd++;
          }

          if(allEnd >= this.schedules.length){
            if(sto){
              clearTimeout(sto);
              this.cTime = null;
            }
          }
          this.schedules[i].diff = diff;
          this.schedules[i].eDiff = eDiff;
        }
      },
      onLogin(){
        this.setLogin(true);
      },
      getPresence(){
        let schedules = [];
        for (var i = 0; i < this.schedules.length; i++) {
          const s = {__type:'Pointer',className:'Schedule', objectId:this.schedules[i].objectId};
          schedules.push(s);
        }
        this.$parsemi.presenceMultiSchedules(schedules, this.afterGetPresence);
      },
      afterGetPresence(data){
        if(data && data.length > 0){
          for (var i = 0; i < this.schedules.length; i++) {
            const p = data.find(item => item.get('schedule').id == this.schedules[i].objectId);
            if(p){
              this.schedules[i].presence = p;
            }
          }
        }
        this.$parsemi.serverTime(this.serverTime);
      },
      enterConfirm(item, index, status){
        // TODO:'Apakah Anda sudah di tempat KBM berlangsung?'
        this.$dialog
        .confirm({title:"Peringatan!", body:'Apakah Anda sudah siap melaksanakan KBM?'}, {okText:'Ya, Masuk', cancelText:'Belum'})
        .then(() => {
          this.savePresence(item, index, status);
          const name =  this.$parsemi.current().name;
          const message = {messageKey: this.schedules[this.scheduleIndex].objectId, owner: "Bot", message: name + " telah masuk."};
          this.$parsemi.setMessage(()=>{}, message);
        });
      },
      // item = schedule
      // TODO STATUS, see enterConfirm(item, index, status)
      savePresence(item, index, status=null, token=null){
        loader = this.$loading.show();
        this.scheduleIndex = index;
        if(!status){
          status = "Tepat";
          const gts = this.getTimeString(item);
          if(gts.diff > 10){
            status = "Lambat";
          }
        }
        let source = 'Self';
        if(this.$parsemi.isPos('Siswa'))
          source = 'Token:' + token;
        const mdNow = {'status': status, 'approve': this.$parsemi.current().objectId, 'subject': item.objectId, 'date': this.$parsemi.today().dDate, 'source': source};
        let presence = item.presence;
        if(presence){
          let metaData = presence.get('metaData');
          metaData[this.$parsemi.today().weekMonth] = mdNow;
          let total = presence.get('total');
          total.Total = total.Total > 0 ? (total.Total + 1) : 1;
          total[status] = total[status] > 0 ? (total[status] + 1) : 1;
          presence.set('metaData', metaData);
          presence.set('total', total);
          presence.save(this.$parsemi.sessionToken()).then(this.settlePresence).catch(this.$parsemi.errorHandler);
        } else {
          let presenceData = {
            owner: {__type:'Pointer',className:'_User', objectId: this.user.objectId},
            schedule: {__type:'Pointer',className:'Schedule',objectId:item.objectId},
            dMonth: this.$parsemi.today().dMonth,
            total: { Total: 1 },
            metaData: [null, null, null, null],
          };
          presenceData.total['Week'] = this.getNumbersDow(item.dow);
          presenceData.total[status] = 1;
          presenceData.metaData[this.$parsemi.today().weekMonth] = mdNow;
          this.$parsemi.setPresence(presenceData, this.settlePresence);
        }
      },
      getNumbersDow(dow){
        const date = this.$parsemi.local();
        if(dow > 7) 
          return false;
        const numDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        if(numDays == 28){
          return 4;
        }
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDow = firstDay.getDay() + 1;
        if(numDays == 29){
          if(dow == firstDow)
            return 5;
          else
            return 4;
        }
        const rule = {'30': 1, '31': 2};
        const max = (firstDow + rule[numDays]);
        if(dow >= firstDow && dow <= max){
          return 5;
        }
        // if out of week number
        if(max > 7){
          const rd = max % 7;
          if(dow <= rd)
            return 5;
          else 
            return 4;
        }
        return 4;
      },
      isPresenced(item){
        const presence = item.presence;
        if(presence){
          const md = presence.get('metaData');
          if(md.length > 0){
            return md[this.$parsemi.today().weekMonth];
          }
        }
        return false;
      },
      isEnter(item){
        const presence = item.presence;
        if(presence){
          const md = presence.get('metaData');
          if(md.length > 0){
            const s = md[this.$parsemi.today().weekMonth];
            if(s.status == "Tepat" || s.status == "Lambat")
              return true;
          }
        }
        return false;
      },
      settlePresence(d){
        this.schedules[this.scheduleIndex].presence = d;
        if(loader)
          loader.hide();
        this.goToPresence(this.scheduleIndex);
      },
      goToPresence(index){
        Storage.saveTemp('schedule', this.schedules[index]);
        this.$router.push('/presence');
      },
      getToken(sch, index){
        this.scheduleIndex = index;
        this.$dialog
          .prompt({
            title: "Masukkan Token",
          }, {okText: "Masuk", cancelText: "Batal"})
          .then(dialog => {
            if(!dialog.data)
              this.$dialog.alert({title: "Informasi", body: "Token tidak boleh kosong!"}, {okText: "Ok"});
            else
              this.$parsemi.getToken(this.afterGetToken, sch.objectId, dialog.data);
          });
      },
      afterGetToken(data){
        if(data){
          const gts = this.getTimeString(data);
          if(gts.eDiff > 0){
            this.savePresence(this.schedules[this.scheduleIndex], this.scheduleIndex, null, data.token);

            if(this.$parsemi.isPos('Siswa')){
              const name =  this.$parsemi.current().name;
              const message = {messageKey: this.schedules[this.scheduleIndex].objectId, owner: "Bot", message: name + " telah masuk."};
              this.$parsemi.setMessage(()=>{}, message);
            }
        
          } else {
            this.$dialog.alert({title: "Informasi", body: "Waktu Token ini habis. Silahkan hubungi Pengajar."}, {okText: "Ok"});
          }
        } else {
          this.$dialog.alert({title: "Informasi", body: "Token tidak tersedia!"}, {okText: "Ok"});
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      if(sto)
        clearTimeout(sto);
      next();
    }
  }
</script>