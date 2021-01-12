<template src="./login.html" />
<style scoped>
.bg-grad {
  background-color: #545f57;
  padding: 30px 20px 50px;
}
.card {
  background: #ffffff4d !important;
}
.form-input {
  background: #ffffff59 !important;
}
.imageRotateHorizontal {
    -moz-animation: spinHorizontal 3s infinite linear;
    -o-animation: spinHorizontal 3s infinite linear;    
    -webkit-animation: spinHorizontal 3s infinite linear;
    animation: spinHorizontal 3s infinite linear;
}

@keyframes spinHorizontal {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
}
</style>

<script>
  import iLogo from "@/assets/logo.png"
  import Storage from "@/components/Storage"

  export default {
    name: 'LoginPage',
    props: ['setLogin'],
    data () {
    return {
      iLogo: iLogo,
      username: "",
      password: "",
    }},
    methods: {
      onLogin(){
        if(this.username.length < 3 || this.password < 3) {
          this.$parsemi.errorHandler({code: "LOGIN", message: "Pastikan Username dan Password Benar!"});
          return;
        }
        this.$parsemi.logIn(this.username, this.password, this.afterLogin);
      },
      afterLogin(data){
        Storage.clear();
        Storage.saveJSON("current", data);
        this.setLogin(true);
      }
    }
  }
</script>