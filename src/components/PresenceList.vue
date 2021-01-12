<template>
  <div class="column col-12 card">
    <div v-if="presences" class="card-body">
      <div class="tile" v-for="(item, index) in presences" :key="index">
        <div class="tile-icon">
          <span class="icon icon-check mt-2"></span>
        </div>
        <div v-if="bySchedule" class="tile-content">
          <p v-if="item.owner" class="tile-title mt-2 mb-1 text-bold">{{item.owner.name}}</p>
          <div class="tile-subtitle mb-1">
            <template v-for="(val, key) in item.total" >
            <div class="chip" v-html="getFigure(val, key)" :key="key" v-if="val > 0">
            </div>
            </template>
            <div class="mb-1"></div>
            <div class="bar" v-html="getBar(item)"></div>
          </div>
        </div>
        <div v-else class="tile-content">
          <p v-if="item.schedule && item.schedule.subject" class="tile-title mb-1 mt-2 text-bold">{{item.schedule.subject.code}} ({{item.schedule.room.name}} - {{$parsemi.hDow(item.schedule.dow)}}/{{item.schedule.hourStart}})</p>
          <div class="tile-subtitle mb-1">
            <div class="chip" v-for="(val, key) in item.total" v-html="getFigure(val, key)" :key="key">
            </div>
            <div class="mb-1"></div>
            <div class="bar" v-html="getBar(item)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PresenceList',
    props: ["presences", "bySchedule"],
    methods: {
      getBar(item){
        let total = item.total.Total | 0;
        const week = item.total.Week | 0;
        if(week)
          total = week;
        const tepat = item.total.Tepat | 0;
        const lambat = item.total.Lambat | 0;
        const persHadir = Math.round((tepat+lambat)/total*100);
        return `<div class="bar-item" role="progressbar" style="width:`+persHadir+`%;" aria-valuemin="0" aria-valuemax="100">`+persHadir+`%</div>`;
      },
      getFigure(val, key){
        if(val <= 0)
          return;
        let color = null;
        if(key == 'Total' || key == 'Jadwal'){
          if(key == 'Total')
            key = 'σ';
          color = "000000";
        } else if(key == 'Week'){
          key = 'Σ';
          color = "5755d9";
        } else {
          switch(key){
            case 'Tepat':
              color = '2d9426';
              break;
            case 'Lambat':
              color = '676b67';
              break;
            case 'Dispen':
              color = 'dc8438';
              break;
            case 'Sakit':
              color = 'a79b12';
              break;
            case 'Izin':
              color = '03a9f4';
              break;
            case 'Alpa':
              color = 'cc3333';
              break;
            case 'Kosong':
              color = '9c27b0';
              break;
          }
        }
        return `<figure class="avatar avatar-sm" data-initial="`+ key.charAt(0) + `" style="background-color: #`+ color +` !important;"></figure>`+val;
      },
    }
  }
</script>