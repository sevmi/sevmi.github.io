<template>
<div>
  <div id="scroll-me" v-bind:style="{ overflowY: 'scroll', height: wHeight + 'px' }">
    <div class="tile" v-for="(item, index) in messages" :key="index">
      <div class="tile-icon">
        <figure v-if="item.owner == 'Bot'" class="avatar pad-user bg-error">
          <i class="icon icon-emoji"></i>
        </figure>
        <figure v-else class="avatar pad-user">
          <i class="icon icon-people"></i>
        </figure>
      </div>
      <div class="tile-content">
        <div class="tile-title text-bold">{{item.owner}}</div>
        <div class="tile-subtitle">{{item.message}}</div>
        <div class="mb-2 text-right pr-2 text-gray"><small>{{$parsemi.hDate(new Date(item.updatedAt))}}</small></div>
      </div>
    </div>
  </div>
  <div class="input-group pos-form">
    <input v-model="message" class="form-input" type="text">
    <button :disabled="isDisabled" @click="onSend" class="btn btn-primary input-group-btn">Send</button>
  </div>
</div>
</template>

<script>
  export default {
    name: 'PresenceList',
    props: ["messages", "messageKey"],
    mounted(){
      if(this.$parsemi.isPos('Siswa')){
        this.wHeight = this.wHeight + 42;
      }
      this.to = setTimeout(this.scrollToEnd, 300);
      this.subscribeMessage();
    },
    data() {
      return {
        wHeight: (window.innerHeight - 158 - 72),
        owner: this.$parsemi.current(),
        message: null,
        to: null,
        isDisabled: false,
      }
    },
    methods: {
      scrollToEnd(){
        let container = this.$el.querySelector("#scroll-me");
        container.scrollTop = container.scrollHeight;
        if(this.to)
          clearTimeout(this.to);
      },
      onSend(){
        this.isDisabled = true;
        if(this.message && this.message.length > 2){
          this.scrollToEnd();
          this.$parsemi.setMessage(this.afterSend, {messageKey: this.messageKey, owner: this.owner.name, message: this.message});
        }
      },
      afterSend(){
        this.message = null;
      },
      subscribeMessage(){
        this.$parsemi.subsrcibe(this.onSubscribeMessage, "Message", "messageKey", this.messageKey)
      },
      onSubscribeMessage(data){
        data.on('create', this.settleMessage);
      },
      settleMessage(data){
        this.messages.push(data.toJSON());
        this.isDisabled = false;
        this.to = setTimeout(this.scrollToEnd, 100);
      },
    }
  }
</script>

<style scoped>
  .pos-form {
    position: relative;
    bottom: 0;
  }
  .pad-user {
    padding: 3px;
    text-align: center;
  }
</style>