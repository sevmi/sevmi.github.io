(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5620acb9","chunk-2d0b20f7"],{"159b":function(t,a,e){var s=e("da84"),i=e("fdbc"),r=e("17c2"),c=e("9112");for(var n in i){var l=s[n],o=l&&l.prototype;if(o&&o.forEach!==r)try{c(o,"forEach",r)}catch(u){o.forEach=r}}},"17c2":function(t,a,e){"use strict";var s=e("b727").forEach,i=e("a640"),r=e("ae40"),c=i("forEach"),n=r("forEach");t.exports=c&&n?[].forEach:function(t){return s(this,t,arguments.length>1?arguments[1]:void 0)}},2300:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"column col-12 card"},[t.presences?e("div",{staticClass:"card-body"},t._l(t.presences,(function(a,s){return e("div",{key:s,staticClass:"tile"},[t._m(0,!0),t.bySchedule?e("div",{staticClass:"tile-content"},[a.owner?e("p",{staticClass:"tile-title mt-2 mb-1 text-bold"},[t._v(t._s(a.owner.name))]):t._e(),e("div",{staticClass:"tile-subtitle mb-1"},[t._l(a.total,(function(a,s){return[a>0?e("div",{key:s,staticClass:"chip",domProps:{innerHTML:t._s(t.getFigure(a,s))}}):t._e()]})),e("div",{staticClass:"mb-1"}),e("div",{staticClass:"bar",domProps:{innerHTML:t._s(t.getBar(a))}})],2)]):e("div",{staticClass:"tile-content"},[a.schedule&&a.schedule.subject?e("p",{staticClass:"tile-title mb-1 mt-2 text-bold"},[t._v(t._s(a.schedule.subject.code)+" ("+t._s(a.schedule.room.name)+" - "+t._s(t.$parsemi.hDow(a.schedule.dow))+"/"+t._s(a.schedule.hourStart)+")")]):t._e(),e("div",{staticClass:"tile-subtitle mb-1"},[t._l(a.total,(function(a,s){return e("div",{key:s,staticClass:"chip",domProps:{innerHTML:t._s(t.getFigure(a,s))}})})),e("div",{staticClass:"mb-1"}),e("div",{staticClass:"bar",domProps:{innerHTML:t._s(t.getBar(a))}})],2)])])})),0):t._e()])},i=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"tile-icon"},[e("span",{staticClass:"icon icon-check mt-2"})])}],r={name:"PresenceList",props:["presences","bySchedule"],methods:{getBar:function(t){var a=0|t.total.Total,e=0|t.total.Week;e&&(a=e);var s=0|t.total.Tepat,i=0|t.total.Lambat,r=Math.round((s+i)/a*100);return'<div class="bar-item" role="progressbar" style="width:'+r+'%;" aria-valuemin="0" aria-valuemax="100">'+r+"%</div>"},getFigure:function(t,a){if(!(t<=0)){var e=null;if("Total"==a||"Jadwal"==a)"Total"==a&&(a="σ"),e="000000";else if("Week"==a)a="Σ",e="5755d9";else switch(a){case"Tepat":e="2d9426";break;case"Lambat":e="676b67";break;case"Dispen":e="dc8438";break;case"Sakit":e="a79b12";break;case"Izin":e="03a9f4";break;case"Alpa":e="cc3333";break;case"Kosong":e="9c27b0";break}return'<figure class="avatar avatar-sm" data-initial="'+a.charAt(0)+'" style="background-color: #'+e+' !important;"></figure>'+t}}}},c=r,n=e("2877"),l=Object(n["a"])(c,s,i,!1,null,null,null);a["default"]=l.exports},4160:function(t,a,e){"use strict";var s=e("23e7"),i=e("17c2");s({target:"Array",proto:!0,forced:[].forEach!=i},{forEach:i})},"67ff":function(t,a,e){t.exports=e.p+"img/bg-edu-overlay.470ed790.jpg"},"6cd9":function(t,a,e){"use strict";var s=e("b7a9"),i=e.n(s);i.a},a640:function(t,a,e){"use strict";var s=e("d039");t.exports=function(t,a){var e=[][t];return!!e&&s((function(){e.call(null,a||function(){throw 1},1)}))}},b3d7:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"columns"},[e("div",{staticClass:"column col-12 panel"},[e("div",{staticClass:"panel-header text-center",style:{"background-image":"url("+t.iBgCardO+")"}},[e("figure",{staticClass:"avatar avatar-lg"},[e("img",{attrs:{src:t.iUser,alt:"Avatar"}})]),e("div",{staticClass:"panel-title h5 mt-10"},[t._v(t._s(t.user.name))]),e("div",{staticClass:"panel-subtitle"},[t._v(t._s(t.user.position.join(", ")))])]),e("div",{staticClass:"panel-body"},[e("div",{staticClass:"tile tile-centered"},[e("div",{staticClass:"tile-content"},[e("div",{staticClass:"tile-title"},[t._v("Persentase Kehadiran / Jadwal")]),e("small",{staticClass:"tile-subtitle text-primary"},[e("i",{staticClass:"icon icon-share"}),t._v(" "+t._s(t.graph.Tepat+t.graph.Lambat)+"/"+t._s(t.graph.totalSchedule))]),e("div",{staticClass:"bar",domProps:{innerHTML:t._s(t.getGraph(1))}})])]),e("div",{staticClass:"tile tile-centered"},[e("div",{staticClass:"tile-content"},[e("div",{staticClass:"tile-title"},[t._v("Persentase Tepat Waktu")]),e("small",{staticClass:"tile-subtitle text-primary"},[e("i",{staticClass:"icon icon-share"}),t._v(" "+t._s(t.graph.Tepat)+"/"+t._s(t.graph.Tepat+t.graph.Lambat))]),e("div",{staticClass:"bar",domProps:{innerHTML:t._s(t.getGraph(2))}})])])])]),e("div",{staticClass:"m-1"}),t.scCount>0?e("div",{staticClass:"toast toast-error text-center"},[e("router-link",{attrs:{to:"/schedule"}},[t._v(" Anda memiliki "),e("b",[t._v(t._s(t.scCount)+" jadwal hari ini "),e("i",{staticClass:"icon icon-arrow-right anim-left"})])])],1):t._e(),e("div",{staticClass:"m-1"}),e("div",{staticClass:"column col-12 card"},[e("div",{staticClass:"card-header"},[e("div",{staticClass:"card-title h5"},[t._v("Histori Kehadiran Anda")]),e("div",{staticClass:"card-subtitle text-primary"},[t._v(t._s(t.$parsemi.today().hMonth))])])]),e("PresenceList",{attrs:{presences:t.history}})],1)},i=[],r=(e("4160"),e("b64b"),e("159b"),e("c121")),c=e.n(r),n=e("67ff"),l=e.n(n),o=e("3fd0"),u=e("2300"),d={name:"HomePage",components:{PresenceList:u["default"]},data:function(){return{iUser:c.a,iBgCardO:l.a,user:this.$parsemi.current(),history:[],graph:{totalSchedule:0,Total:0,Tepat:0,Lambat:0},scCount:0}},mounted:function(){this.getHistory();var t=o["a"].getTemp("schedules");t&&t.length>0&&(this.scCount=t.length)},methods:{getScheduleCount:function(){this.$parsemi.getAllSchedule(this.afterCount)},onLogin:function(){this.setLogin(!0)},getHistory:function(){this.$parsemi.getPresences(this.afterHistory)},calculateGraph:function(t){for(var a=0,e=0,s=function(){var s=t[i].total;Object.keys(s).forEach((function(t){"Tepat"==t&&s[t]>0&&(a+=s[t]),"Lambat"==t&&s[t]>0&&(e+=s[t])}))},i=0;i<t.length;i++)s();this.graph.Tepat=a,this.graph.Lambat=e},getGraph:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;if(!(this.graph.totalSchedule<=0)){var a=Math.round((this.graph.Tepat+this.graph.Lambat)/this.graph.totalSchedule*100*100)/100;return 2==t&&(a=Math.round(this.graph.Tepat/(this.graph.Tepat+this.graph.Lambat)*100*100)/100),'<div class="bar-item" role="progressbar" style="width:'+a+'%;">'+a+"%</div>"}},afterHistory:function(t){for(var a=0,e=0;e<t.length;e++)a+=t[e].total.Week;this.graph.totalSchedule=a,this.history=t,this.calculateGraph(t)}}},h=d,p=(e("6cd9"),e("2877")),v=Object(p["a"])(h,s,i,!1,null,"2efc67d5",null);a["default"]=v.exports},b64b:function(t,a,e){var s=e("23e7"),i=e("7b0b"),r=e("df75"),c=e("d039"),n=c((function(){r(1)}));s({target:"Object",stat:!0,forced:n},{keys:function(t){return r(i(t))}})},b7a9:function(t,a,e){},c121:function(t,a,e){t.exports=e.p+"img/user.d97c517b.png"}}]);
//# sourceMappingURL=chunk-5620acb9.75b83f6d.js.map