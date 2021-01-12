<template src="./tile-presence.html" />

<script>
  let loader = null;
  export default {
    name: 'TilePresence',
    props: ["schedule", "user", "index", "update", "uIndex"],
    data(){
      return {
        today: this.$parsemi.today(),
      }
    },
    methods: {
      presenceStat(){
        const presence = this.user.presence;
        let persM = 0;
        let persT = 0;
        if(presence){
          const t = presence.get('total');
          const Total = t.Total | 0;
          const Tepat = t.Tepat | 0;
          const Lambat = t.Lambat | 0;
          if(Total > 0){
            persM = (Tepat+Lambat)/Total*100;
            persT = 100-persM;
          }
        }
        return `<small class="tile-subtitle text-success"><i class="icon icon-check"></i> `+persM+`%</small>
          <small class="tile-subtitle text-error ml-10"><i class="icon icon-cross"></i> `+persT+`%</small>`;
      },
      isPresenced(){
        const presence = this.user.presence;
        if(presence){
          const md = presence.get('metaData');
          if(md.length > 0){
            return md[this.today.weekMonth];
          }
        }
        return false;
      },
      presenceStatus(){
        if(!this.user.presence)
          return;
        const md = this.user.presence.get('metaData');
        const status = md[this.today.weekMonth].status;
        let style = "default";
        switch(status){
          case 'Tepat':
            style = "success";
            break;
          case 'Lambat':
            style = "secondary";
            break;
          case 'Sakit':
            style = "warning";
            break;
          case 'Dispen':
            style = "primary";
            break;
          case 'Alpa':
            style = "error";
            break;
        }
        return `<button class="btn btn-rounded btn-`+style+`">`+status+`</button>`;
      },
      removePresence(){
        loader = this.$loading.show();
        let presence = this.user.presence;
        let metaData = presence.get('metaData');
        const mdStatus = metaData[this.today.weekMonth];
        const status = mdStatus.status;
        let total = presence.get('total');
        total.Total = total.Total > 0 ? (total.Total - 1) : 0;
        total[status] = total[status] > 0 ? (total[status] - 1) : 0;
        metaData[this.today.weekMonth] = null;
        presence.set('metaData', metaData);
        presence.set('total', total);
        presence.save(this.$parsemi.sessionToken()).then(this.settlePresence).catch(this.$parsemi.errorHandler);
      },
      onPresence(status){
        loader = this.$loading.show();
        const mdNow = {'status': status, 'approve': this.$parsemi.current().objectId, 'subject': this.schedule.subject.objectId, 'date': this.$parsemi.today().dDate, 'source': 'Guru'};
        let presence = this.user.presence;
        if(presence){
          let metaData = presence.get('metaData');
          metaData[this.today.weekMonth] = mdNow;
          let total = presence.get('total');
          total.Total = total.Total > 0 ? (total.Total + 1) : 1;
          total[status] = total[status] > 0 ? (total[status] + 1) : 1;
          presence.set('metaData', metaData);
          presence.set('total', total);
          presence.save(this.$parsemi.sessionToken()).then(this.settlePresence).catch(this.$parsemi.errorHandler);
        } else {
          let presenceData = {
            owner: {__type:'Pointer',className:'_User',objectId: this.user.objectId},
            schedule: {__type:'Pointer',className:'Schedule',objectId:this.schedule.objectId},
            dMonth: this.today.dMonth,
            total: { Total: 1 },
            metaData: [null, null, null, null],
          };
          presenceData.total['Week'] = this.getNumbersDow(this.schedule.dow);
          presenceData.total[status] = 1;
          presenceData.metaData[this.today.weekMonth] = mdNow;
          this.$parsemi.setPresence(presenceData, this.settlePresence);
        }
      },
      settlePresence(d){
        let user = {...this.user};
        user.presence = d;
        this.$emit("update", user, this.index);
        if(loader)
          loader.hide();
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

    }
  }
</script>