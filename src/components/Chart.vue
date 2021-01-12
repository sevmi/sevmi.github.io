<template>
  <div v-if="data && width > 0" style="width: 100%; text-align: center;">
    <canvas id="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
  const barColor = {Tepat: "#2d9426", Lambat: "#676b67", Dispen: "#dc8438", Sakit: "#a79b12", Izin: "#03a9f4", Alpa: "#cc3333", Kosong: "#9c27b0"};

  export default {
    name: 'ChartPage',
    props: ["data", "refer"],
    mounted(){
      this.calculateWH();
    },
    watch: {
      'refer' () {
        this.calculateWH();
      }
    },
    data(){
      return {
        vCanvas: null,
        width: 0,
        height: 0,
        widthBar: 40,
        distance: 10,
        dataLength: 0,
      }
    },
    methods: {
      calculateWH(){
        if(this.data){
          const dataLength = Object.keys(this.data).length;
          if(dataLength > 1){
            this.dataLength = dataLength - 2; // remove key: Total
            this.width = (this.widthBar + this.distance) * this.dataLength - this.distance;
            if(this.width > 0){
              this.$nextTick(()=>{
                this.initChart();
              });
            }
          }
        }
      },
      initChart(){
        let c = document.getElementById("canvas");
        if(c){
          let ctx = c.getContext("2d");    
          this.vCanvas = ctx;
          this.$nextTick(()=>{
            this.draw();
          });
        }
      },
      clear(){
        this.vCanvas.clearRect(0, 0, this.width, this.height);
      },
      draw(){
        this.clear()
        let xPos = 0;
        Object.keys(this.data).forEach((key)=>{
          if((key == 'Week' && this.refer == 'Total') || key == 'Total'){
            return;
          } else {
            if(key != this.refer){
              const h = Math.round(this.data[key] / this.data[this.refer] * 100);
              if(h > (this.height - 20)){
                this.height = h + 20;
                this.$nextTick(()=>{
                  this.initChart();
                });
              }
              this.vCanvas.fillStyle = barColor[key];
              this.vCanvas.fillRect(xPos, this.height - h - 1, this.widthBar, h - 1);
              this.vCanvas.textAlign = "center";
              this.vCanvas.fillText((h+"%"), xPos + (this.widthBar/2), this.height - h -5);
              xPos += (this.widthBar + this.distance);
            }
          }
        });
      }
    }
  }
</script>