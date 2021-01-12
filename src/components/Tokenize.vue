<template>
  <div v-if="tokenToast" class="toast toast-primary">
    <template v-if="token">
      Token <i class="icon icon-arrow-right"></i> <span class="label label-error">{{token.token}}</span> <i class="icon icon-arrow-right"></i> {{token.hourStart}} - {{token.hourEnd}}
    </template>
    <label @click="generate" v-if="!token" class="label label-error">Buat Token Sekarang</label>
    <button class="btn btn-clear float-right" @click="removeToken"></button>
  </div>
</template>

<script>
  let loader;
  export default {
    name: 'TokenizePage',
    props: ["tokenRef"],
    mounted(){
      this.createLoader();
      this.$parsemi.getToken(this.afterGet, this.tokenRef.objectId)
    },
    data(){
      return {
        tokenToast: true,
        token: null,
      }
    },
    methods: {
      createLoader(){
        loader = this.$loading.show();
      },
      removeLoader(){
        if(loader)
          loader.hide();
      },
      afterGet(data){
        this.token = data;
        this.removeLoader();
      },
      generate(){
        this.createLoader()
        const hourEndString = this.tokenRef.hourStart;
        let splitHourEnd = hourEndString.split(':');
        let h = Number(splitHourEnd[0]);
        let m = Number(splitHourEnd[1]);
        if(m > 0){
          m = 0;
          h = h + 1;
        } else {
          m = 30;
        }
        const hourEnd = String(h).padStart(2, '0') + ":" + String(m).padStart(2, '0');
        const token = {
          tokenKey: this.tokenRef.objectId,
          hourStart: this.tokenRef.hourStart,
          hourEnd: hourEnd,
          token: this.random(6)
        };
        this.$parsemi.generateToken(this.afterGet, token);
      },
      random(length){
        let result = Math.random().toString(36).substr(2, length);
        return result.toUpperCase();
      },
      removeToken(){
        if(this.token){
          this.$dialog
          .confirm({title:"Peringatan!", body:'Apakah Anda yakin akan menghapus Token?'}, {okText:'Ya, Hapus', cancelText:'Tidak'})
          .then(() => {
            this.$parsemi.removeToken(this.afterRemove, this.tokenRef.objectId);
          }).catch(() => {});
        } else {
          this.afterRemove();
        }
      },
      afterRemove(){
        this.tokenToast = false;
        this.token = null;
      }
    }
  }
</script>