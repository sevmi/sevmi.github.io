<template>
<div style="padding-left: 10px;">
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
</div>
</template>

<script>
  export default {
    name: 'MessagePage',
    mounted(){
      this.to = setTimeout(this.scrollToEnd, 300);
      this.getMessage();
      this.subscribeMessage();
    },
    data() {
      return {
        wHeight: (window.innerHeight),
        owner: this.$parsemi.current(),
        messages: null,
        to: null,
      }
    },
    methods: {
      scrollToEnd(){
        let container = this.$el.querySelector("#scroll-me");
        container.scrollTop = container.scrollHeight;
        if(this.to)
          clearTimeout(this.to);
      },
      getMessage(){
        this.$parsemi.messages(this.afterMessage);
      },
      afterMessage(data){
        this.messages = data;
      },
      subscribeMessage(){
        this.$parsemi.subsrcibe(this.onSubscribeMessage, "Message")
      },
      onSubscribeMessage(data){
        data.on('create', this.settleMessage);
      },
      settleMessage(data){
        this.messages.push(data.toJSON());
        this.to = setTimeout(this.scrollToEnd, 100);
      },
      beforeRouteLeave(to, from, next) {
        this.$parsemi.unsubscribe();
        next();
      }
    }
  }
</script>

<style scoped>
  .pad-user {
    padding: 3px;
    text-align: center;
  }
</style>