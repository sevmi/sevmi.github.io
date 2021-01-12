import Parse from 'parse'
import Storage from "./Storage"
import Pipeline from "./pipeline"

Parse.initialize("pLhf05ljX1GMzdkjSSeT2fX3XFTSJrwZIe7Uzjs9");
Parse.masterKey = "ez6Fhh3ac8MzYOn8e2tL9bOnQpboxOfn7svxciZ2";
Parse.serverURL = 'https://sevmi.herokuapp.com/parse';
// Parse.serverURL = 'http://localhost:1337/parse';

let loader;

export default {
  install(Vue){
    const methods = {
      serverTime(callback){
        Parse.Cloud.run("serverTime").then(callback).catch(this.errorHandler);
      },
      toJSON (ParseObjectList, callback, removeLoader=true) {
        if(Array.isArray(ParseObjectList)){
          let toJson = [];
          for (var i = 0; i < ParseObjectList.length; i++) {
            toJson.push(ParseObjectList[i].toJSON());
          }
          this.removeLoader(toJson, callback);
        } else {
          if(removeLoader){
            if(ParseObjectList)
              this.removeLoader(ParseObjectList.toJSON(), callback);
            else
              this.removeLoader(ParseObjectList, callback);
          } else {
            if(ParseObjectList)
              callback(ParseObjectList.toJSON());
            else
              callback(ParseObjectList);
          }
        }
      },
      requestHandler(callback, model, select=null, include=null, isFirst=false, isJson=true, wk1=null, wv1=null, wk2=null, wv2=null, asc=null, contains=null) {
        this.loader();
        var r = new Parse.Query(Parse.Object.extend(model))
        .select(select)
        .equalTo(wk1, wv1)
        .equalTo(wk2, wv2)
        .include(include);
        if(contains){
          r = r.containedIn(contains);
        }
        if(asc)
          r = r.ascending(asc);
        if(isFirst)
          r = r.first(this.sessionToken());
        else  
          r = r.find(this.sessionToken());
        if(isJson)
          r.then(data => this.toJSON(data, callback)).catch(this.errorHandler);
        else
          r.then(data=>this.removeLoader(data, callback)).catch(this.errorHandler);
      },
      hDow(num = 0){
        if(typeof(num) != "number"){
          num = Number(num);
        }
        num = num - 1;
        const hd = ["Ahd", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        return hd[num];
      },
      hDate(date, noTime=false){
        date = this.local(date);
        let day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        let month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        let year = date.getFullYear();
        let h = String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
        if(noTime)
          return day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + year;
        else 
          return day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + year + " " +h;
      },
      errorHandler (error) {
        if(loader)
          loader.hide();
        Vue.prototype.$dialog.alert({title: "Error: " + error.code, body: error.message}, {okText: "Ok"});
        console.log(error);
      },
      removeLoader(data, callback){
        if(loader)
          loader.hide();
        callback(data);
      },
      local(date, offset){
        if(!offset)
          offset = 7;
        if(!date)
          date = new Date();
        var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000*offset));
      },
      today(){
        const date = this.local();
        const dow = date.getDay() + 1;
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const dMonth = date.getFullYear() + "-" + m;
        const weekMonth = 0 | date.getDate() / 7;
        const dDate = dMonth + "-" + String(date.getDate()).padStart(2, '0');
        const hm = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const hMonth = hm[date.getMonth()] + " " + date.getFullYear();
        return {dow: dow, dMonth: dMonth, weekMonth: weekMonth, dDate: dDate, hMonth: hMonth};
      },
      current(){
        return Storage.getJSON("current");
      },
      isPos(pos){
        const current = this.current();
        if(current){
          for (var i = 0; i < current.position.length; i++) {
            if(current.position[i] == pos){
              return true;
            }
          }
        }
        return false;
      },
      sessionToken(){
        const user = this.current();
        return {sessionToken: user.sessionToken};
      },
      loader(){
        loader = Vue.prototype.$loading.show();
      },
      logIn (username, password, callback) {
        this.loader();
        Parse.User.logIn(username, password).then(data=>this.removeLoader(data, callback)).catch(this.errorHandler);
      },
      logOut(callback) {
        this.loader();
        Parse.User.logOut(this.sessionToken()).then(data=>this.removeLoader(data, callback)). catch(this.errorHandler);
        Storage.remove("current");
        Storage.remove("myRoom");
        Storage.removeTemp();
      },
      schedules(callback, owner) {
        if(!owner)
          owner = this.current().objectId;
        if(owner.__type != 'Pointer')
          owner = {__type:'Pointer', className:'_User', objectId: owner};
        this.requestHandler(callback, "Schedule", ['dow', 'hourStart', 'hourEnd', 'room.name', 'subject.code', 'subject.name'], "subject, room", false, true, "dow", this.today().dow, "owner", owner, "hourStart");
      },
      roomSchedule(callback, roomId){
        const room = {__type:'Pointer', className:'Room', objectId: roomId};
        this.requestHandler(callback, "Schedule", ['dow', 'hourStart', 'hourEnd', 'subject.code', 'subject.name', 'room'], "subject", false, true, "dow", this.today().dow, "room", room, "hourStart");
      },
      room(roomId, callback) {
        this.requestHandler(callback, "Room", ['name', 'users', 'users.name'], "users", true, true, "objectId", roomId);
      },
      // presence by user
      presence(callback, userId=null, dMonth=null){
        this.loader();
        var q = new Parse.Query(Parse.Object.extend("Presence"));
        if(!userId)
          userId = this.current().objectId;
        q.equalTo("owner", {__type:'Pointer',className:'_User', objectId: userId});
        if(!dMonth)
          dMonth = this.today().dMonth;
        q.equalTo("dMonth", dMonth);
        q.find().then(data=>this.removeLoader(data, callback)).catch(this.errorHandler);
      },
      // presence by scheduleId
      presences(scheduleId, callback, include=null, isJSON=false) {
        this.requestHandler(callback, "Presence", ['owner', 'dMonth', 'total', 'metaData'], include, false, isJSON, "dMonth", this.today().dMonth, "schedule", {__type:'Pointer',className:'Schedule',objectId: scheduleId});
      },
      // has Loader
      setPresence(presenceData, callback) {
        const Presence = Parse.Object.extend('Presence');
        const presence = new Presence();
        presence.save(presenceData).then(callback).catch(this.errorHandler);

      },
      // presence by many schedules
      presenceMultiSchedules(schedules, callback, dMonth=null, isJSON=false) {
        this.loader();
        var q = new Parse.Query(Parse.Object.extend("Presence"));
        q.equalTo("owner", {__type:'Pointer',className:'_User', objectId: this.current().objectId});
        if(!dMonth){
          dMonth = this.today().dMonth;
        }
        q.containedIn("schedule",schedules);
        if(isJSON){
          q.find().then(data=>this.toJSON(data,callback)).catch(this.errorHandler);
        } else {
          q.find().then(data=>this.removeLoader(data,callback)).catch(this.errorHandler);
        }
      },
      getPresences(callback, metaData=null, dMonth=null, owner=null){
        if(!dMonth)
          dMonth = this.today().dMonth;
        if(!owner)
          owner = this.current().objectId;
        if(owner.__type != 'Pointer')
          owner = {__type:'Pointer', className:'_User', objectId: owner};
        const select = ['schedule', 'dMonth', 'total', 'schedule.dow', 'schedule.hourStart', 'schedule.subject.name', 'schedule.subject.code', 'schedule.room.name'];
        if(metaData)
          select.push('metaData');
        this.requestHandler(callback, "Presence", select, "schedule.subject, schedule.room", false, true, "dMonth", dMonth, "owner", owner);
      },
      getAllSchedule(callback, owner=null, isAll=false){
        this.loader();
        if(!owner)
          owner = this.current().objectId;
        if(owner.__type != 'Pointer')
          owner = {__type:'Pointer', className:'_User', objectId: owner};
        var q = new Parse.Query(Parse.Object.extend("Schedule"));
        q.equalTo('owner', owner);
        if(isAll){
          q.select('dow','hourStart','room.name', 'subject.name')
          q.find(this.sessionToken()).then(data=>this.toJSON(data, callback)).catch(this.errorHandler);
        } else {
          q.count(this.sessionToken()).then(data=>this.removeLoader(data, callback)).catch(this.errorHandler);
        }
        
      },
      subjects(callback, contains=null){
        this.loader();
        var q = new Parse.Query(Parse.Object.extend("Subject"));
        if(contains)
          q.containedIn("objectId", contains);
        q.find().then(data=>this.removeLoader(data,callback)).catch(this.errorHandler);
      },
      rooms(callback){
        this.requestHandler(callback, "Room", ['name', 'users'], ['users'], false, true);
      },
      getPresenceUsersTotal(callback, dMonth, inUser){
        this.loader();
        var q = new Parse.Query(Parse.Object.extend("Presence"));
        q.aggregate(Pipeline.PresenceUsersTotal(dMonth, inUser), {useMasterKey: true}).then(data=>this.removeLoader(data, callback)).catch(this.errorHandler);
      },
      getUsers(callback, cv1, ck1){
        this.loader();
        var q = new Parse.Query(Parse.Object.extend("_User"));
        q.select('objectId', 'name')
        q.containedIn(cv1, ck1);
        q.find().then(data=>this.toJSON(data, callback)).catch(this.errorHandler);
      },
      PresenceUsersTotalWithSchedule(callback, dMonth, inUser){
        this.loader();
        var q = new Parse.Query(Parse.Object.extend("Presence"));
        q.aggregate(Pipeline.PresenceUsersTotalWithSchedule(dMonth, inUser), {useMasterKey: true}).then(data=>this.removeLoader(data, callback)).catch(this.errorHandler);
      },
      getToken(callback, tokenKey, token=null){
        var q = new Parse.Query(Parse.Object.extend("Tokenize"));
        q.equalTo("tokenKey", tokenKey);
        if(token)
          q.equalTo("token", token)
        q.first().then(data=>this.toJSON(data, callback, false)).catch(this.errorHandler);
      },
      generateToken(callback, token){
        const Tokenize = Parse.Object.extend('Tokenize');
        const tokenize = new Tokenize();
        tokenize.save(token).then(data=>this.toJSON(data, callback, false)).catch(this.errorHandler);
      },
      removeToken(callback, tokenKey){
        var q = new Parse.Query(Parse.Object.extend("Tokenize"));
        q.equalTo("tokenKey", tokenKey)
        q.first().then(data=>this.removingToken(data, callback)).catch(this.errorHandler);
      },
      removingToken(data, callback){
        if(data){
          data.destroy().then(callback).catch(this.errorHandler);
        } else {
          callback(data);
        }
      },
      myRoom(callback){
        this.loader();
        var q = new Parse.Query(Parse.Object.extend("Room"));
        q.select("name");
        const contains = {__type:'Pointer', className:'_User', objectId: this.current().objectId};
        q.containedIn("users", [contains]);
        q.first().then(data=>this.toJSON(data,callback)).catch(this.errorHandler);
      },
      subsrcibe(callback, className, wk1=null, wv1=null){
        let query = new Parse.Query(Parse.Object.extend(className));
        if(wk1)
          query.equalTo(wk1, wv1);
        query.subscribe().then(callback).catch(this.errorHandler);
      },
      unsubscribe(){
        Parse.LiveQuery.close();
      },
      messages(callback, messageKey=null){
        if(messageKey)
          this.requestHandler(callback, "Message", ['message', 'owner'], null, false, true, "messageKey", messageKey);
        else
          this.requestHandler(callback, "Message", ['message', 'owner'], null, false, true);
      },
      setMessage(callback, message){
        const Message = Parse.Object.extend('Message');
        const messageItem = new Message();
        messageItem.save(message).then(callback).catch(this.errorHandler);
      }
    }
    Vue.prototype.$parsemi = methods;
  }
}