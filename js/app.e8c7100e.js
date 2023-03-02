(function(t){function e(e){for(var n,s,o=e[0],h=e[1],c=e[2],d=0,u=[];d<o.length;d++)s=o[d],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&u.push(a[s][0]),a[s]=0;for(n in h)Object.prototype.hasOwnProperty.call(h,n)&&(t[n]=h[n]);l&&l(e);while(u.length)u.shift()();return r.push.apply(r,c||[]),i()}function i(){for(var t,e=0;e<r.length;e++){for(var i=r[e],n=!0,o=1;o<i.length;o++){var h=i[o];0!==a[h]&&(n=!1)}n&&(r.splice(e--,1),t=s(s.s=i[0]))}return t}var n={},a={app:0},r=[];function s(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=t,s.c=n,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/rain-game/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],h=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var l=h;r.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},1869:function(t,e,i){},"4ef0":function(t,e,i){t.exports=i.p+"img/normal1.ccca2353.webp"},"4f2b":function(t,e,i){t.exports=i.p+"img/clicked.27495d8a.webp"},"56d7":function(t,e,i){"use strict";i.r(e);var n=i("2b0e"),a=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("h3",[t._v("积分：x"+t._s(t.score))]),e("canvas",{attrs:{id:"canvas"}}),e("button",{on:{click:t.play}},[t._v("开始")]),e("button",{on:{click:t.pause}},[t._v("暂停")]),e("button",{on:{click:t.stop}},[t._v("停止")]),e("button",{on:{click:t.add}},[t._v("添加")]),e("button",{on:{click:t.remove}},[t._v("移除")])])},r=[];i("13d5"),i("14d9");class s{constructor(){this.events={}}$on(t,e){(this.events[t]||(this.events[t]=[])).push(e)}$emit(t,...e){(this.events[t]||[]).forEach(t=>t(...e))}}function o(t){return new Promise(e=>{{const i=new Image;i.src=t,i.onload=i.onerror=e(i)}})}const h={NORMAL:1,CLICKED:2};class c extends s{constructor(t){super(),this.$canvas="string"===typeof t.el?document.querySelector(t.el):t.el,this.$canvas.setAttribute("width",this.$canvas.offsetWidth),this.$canvas.setAttribute("height",this.$canvas.offsetHeight),this.ctx=this.$canvas.getContext("2d"),this.preload=t.preload,this.interval=t.interval||500,this.speed=t.speed||2,this.horizontalMovement=t.horizontalMovement,this.originRains=t.rains||[],this.renderRains=[],this.raf=null,this.preGenerateTime=null,this.replay=!1,this.isPlaying=!1,this.preload&&this.loadSource()}async play(){this.isPlaying||(await this.loadSource(),this.replay&&(this.preGenerateTime=Date.now()),this.bindEvent(),this.render(),this.replay=!0,this.isPlaying=!0)}loadSource(){return this.originRains.map(this.loadImageItem)}async loadImageItem(t){t.img||(t.img=await o(t.image),t.clicked&&(t.clicked.img=await o(t.clicked.image)))}bindEvent(){this.handleClickFn=this.handleClick.bind(this),this.$canvas.addEventListener("click",this.handleClickFn)}offEvent(){this.$canvas.removeEventListener("click",this.handleClickFn)}handleClick(t){const{offsetX:e,offsetY:i}=t;for(let n=this.renderRains.length,a=n-1;a>=0;a--){const t=this.renderRains[a],{x:n,y:r,width:s,height:o,rainType:c,boundary:l,originData:d}=t;if(c===h.CLICKED)continue;const u="number"===typeof l?new Array(4).fill(l):Array.isArray(l)?l:new Array(4).fill(0),p=i>=r-(u[0]||0),f=e<=n+s+(u[1]||0),g=i<=r+o+(u[2]||0),m=e>=n-(u[3]||0),v=p&&f&&g&&m;if(v){this.$emit("strike",d);const e=d.clicked;if(e){const i=n+(e.translate&&e.translate[0]?e.translate[0]:0),a=r+(e.translate&&e.translate[1]?e.translate[1]:0);this.removeRain(t),this.addRain({img:e.img,x:i,y:a,width:e.width,height:e.height,rainType:h.CLICKED,start:Date.now(),duration:e.duration||200});break}}}}render(){this.clearRect(),this.generateRain(),this.updateRain(),this.drawRain(),this.raf=window.requestAnimationFrame(this.render.bind(this))}stopRender(){window.cancelAnimationFrame(this.raf)}clearRect(){this.ctx.clearRect(0,0,this.$canvas.width,this.$canvas.height)}generateRain(){if(!this.originRains.length)return;const t=Date.now();if(t-this.preGenerateTime>this.interval){const e=this.getRain();this.addRain(e),this.preGenerateTime=t}}getRain(){const t=this.originRains.map(t=>t.ratio||1),e=t.reduce((t,e)=>(t+=e,t),0),i=Math.random();let n=null,a=0,r=0,s=0,o=t.length;for(;s<o;s++)if(a+=t[s-1]?t[s-1]/e:0,r=a+t[s]/e,i>=a&&i<=r){n=this.originRains[s];break}return{originData:n,img:n.img,x:Math.random()*(this.$canvas.width-n.width),y:-n.height,width:n.width,height:n.height,rainType:h.NORMAL}}addRain(t){this.renderRains.push(t)}updateRain(){this.renderRains.filter(t=>t.rainType===h.CLICKED).forEach(t=>{Date.now()-t.start>t.duration&&this.removeRain(t)}),this.renderRains.filter(t=>t.rainType!==h.CLICKED).forEach(t=>{const{x:e,y:i,width:n,speed:a,directionX:r}=t,s=a||this.speed,o=this.$canvas.offsetWidth/this.$canvas.offsetHeight*s,h=i+s;let c=e;this.horizontalMovement&&(r||(t.directionX=Math.random()>.5?"right":"left"),c=e+o*("right"===r?1:-1),c<0&&(t.directionX="right"),c>this.$canvas.width-n&&(t.directionX="left")),Object.assign(t,{x:c,y:h})})}drawRain(){this.renderRains.forEach(t=>{this.ctx.drawImage(t.img,t.x,t.y,t.width,t.height)})}removeRain(t){const e=this.renderRains.indexOf(t);e>-1&&this.renderRains.splice(e,1)}pause(){this.isPlaying=!1,this.offEvent(),this.stopRender()}async add(t){await this.loadImageItem(t),this.originRains.push(t)}remove(t){const e=this.originRains.indexOf(t);e>-1&&this.originRains.splice(e,1)}stop(){this.isPlaying=!1,this.renderRains=[],this.clearRect(),this.offEvent(),this.stopRender()}}var l={data(){return{score:0}},mounted(){this.rains=[{image:i("6e54"),width:140,height:120,ratio:1,score:2,clicked:{image:i("4f2b"),width:178,height:100,translate:[-2,-2]}}],this.rainGame=new c({el:"#canvas",preload:!0,interval:500,speed:2,horizontalMovement:!0,boundary:4,rains:this.rains}),this.rainGame.$on("strike",t=>{this.score+=t.score,console.log(t)})},methods:{play(){this.score=0,this.rainGame.play()},pause(){this.rainGame.pause()},stop(){this.score=0,this.rainGame.stop()},add(){this.rainGame.add({id:2,image:i("4ef0"),width:100,height:100,ratio:1,score:3,clicked:{image:i("f469"),width:100,height:100,translate:[-2,-2]}})},remove(){this.rainGame.remove(2)}}},d=l,u=(i("c701"),i("2877")),p=Object(u["a"])(d,a,r,!1,null,null,null),f=p.exports;i("8083");n["a"].config.productionTip=!1,new n["a"]({render:t=>t(f)}).$mount("#app")},"6e54":function(t,e,i){t.exports=i.p+"img/normal.40becdab.webp"},8083:function(t,e,i){},c701:function(t,e,i){"use strict";i("1869")},f469:function(t,e,i){t.exports=i.p+"img/clicked1.8b4ed3f3.webp"}});
//# sourceMappingURL=app.e8c7100e.js.map