/**
 *                                                        ____   _____
 *  Dynarch Calendar -- JSCal2, version 1.9               \  /_  /   /
 *  Built at 2011/03/13 10:28 GMT                          \  / /   /
 *                                                          \/ /_  /
 *  (c) Dynarch.com 2009                                     \  / /
 *  All rights reserved.                                       / /
 *  Visit www.dynarch.com/projects/calendar for details        \/
 *
 */
Calendar=function(){function bm(a){typeof a=="string"&&(a=document.getElementById(a));return a}function bk(a,b,c){for(c=0;c<a.length;++c)b(a[c])}function bj(){var a=document.documentElement,b=document.body;return{x:a.scrollLeft||b.scrollLeft,y:a.scrollTop||b.scrollTop,w:a.clientWidth||window.innerWidth||b.clientWidth,h:a.clientHeight||window.innerHeight||b.clientHeight}}function bi(a){var b=0,c=0,d=/^div$/i.test(a.tagName),e,f;d&&a.scrollLeft&&(b=a.scrollLeft),d&&a.scrollTop&&(c=a.scrollTop),e={x:a.offsetLeft-b,y:a.offsetTop-c},a.offsetParent&&(f=bi(a.offsetParent),e.x+=f.x,e.y+=f.y);return e}function bh(a,b){var c=e?a.clientX+document.body.scrollLeft:a.pageX,d=e?a.clientY+document.body.scrollTop:a.pageY;b&&(c-=b.x,d-=b.y);return{x:c,y:d}}function bg(a,b){var c=a.style;b!=null&&(c.display=b?"":"none");return c.display!="none"}function bf(a,b){b===""?e?a.style.filter="":a.style.opacity="":b!=null?e?a.style.filter="alpha(opacity="+b*100+")":a.style.opacity=b:e?/alpha\(opacity=([0-9.])+\)/.test(a.style.opacity)&&(b=parseFloat(RegExp.$1)/100):b=parseFloat(a.style.opacity);return b}function bd(a,b,c){function h(){var b=a.len;a.onUpdate(c/b,d),c==b&&g(),++c}function g(){b&&(clearInterval(b),b=null),a.onStop(c/a.len,d)}function f(){b&&g(),c=0,b=setInterval(h,1e3/a.fps)}function d(a,b,c,d){return d?c+a*(b-c):b+a*(c-b)}a=U(a,{fps:50,len:15,onUpdate:bl,onStop:bl}),e&&(a.len=Math.round(a.len/2)),f();return{start:f,stop:g,update:h,args:a,map:d}}function bc(a,b){if(!b(a))for(var c=a.firstChild;c;c=c.nextSibling)c.nodeType==1&&bc(c,b)}function bb(a,b){var c=ba(arguments,2);return b==undefined?function(){return a.apply(this,c.concat(ba(arguments)))}:function(){return a.apply(b,c.concat(ba(arguments)))}}function ba(a,b){b==null&&(b=0);var c,d,e;try{c=Array.prototype.slice.call(a,b)}catch(f){c=Array(a.length-b);for(d=b,e=0;d<a.length;++d,++e)c[e]=a[d]}return c}function _(a,b,c){var d=null;document.createElementNS?d=document.createElementNS("http://www.w3.org/1999/xhtml",a):d=document.createElement(a),b&&(d.className=b),c&&c.appendChild(d);return d}function $(a,b,c){if(b instanceof Array)for(var d=b.length;--d>=0;)$(a,b[d],c);else Y(b,c,a?c:null);return a}function Z(a,b){return Y(a,b,b)}function Y(a,b,c){if(a){var d=a.className.replace(/^\s+|\s+$/,"").split(/\x20/),e=[],f;for(f=d.length;f>0;)d[--f]!=b&&e.push(d[f]);c&&e.push(c),a.className=e.join(" ")}return c}function X(a){a=a||window.event,e?(a.cancelBubble=!0,a.returnValue=!1):(a.preventDefault(),a.stopPropagation());return!1}function W(a,b,c,d){if(a instanceof Array)for(var f=a.length;--f>=0;)W(a[f],b,c);else if(typeof b=="object")for(var f in b)b.hasOwnProperty(f)&&W(a,f,b[f],c);else a.removeEventListener?a.removeEventListener(b,c,e?!0:!!d):a.detachEvent?a.detachEvent("on"+b,c):a["on"+b]=null}function V(a,b,c,d){if(a instanceof Array)for(var f=a.length;--f>=0;)V(a[f],b,c,d);else if(typeof b=="object")for(var f in b)b.hasOwnProperty(f)&&V(a,f,b[f],c);else a.addEventListener?a.addEventListener(b,c,e?!0:!!d):a.attachEvent?a.attachEvent("on"+b,c):a["on"+b]=c}function U(a,b,c,d){d={};for(c in b)b.hasOwnProperty(c)&&(d[c]=b[c]);for(c in a)a.hasOwnProperty(c)&&(d[c]=a[c]);return d}function T(a){if(/\S/.test(a)){a=a.toLowerCase();function b(b){for(var c=b.length;--c>=0;)if(b[c].toLowerCase().indexOf(a)==0)return c+1}return b(L("smn"))||b(L("mn"))}}function S(a){if(a){if(typeof a=="number")return P(a);if(!(a instanceof Date)){var b=a.split(/-/);return new Date(parseInt(b[0],10),parseInt(b[1],10)-1,parseInt(b[2],10),12,0,0,0)}}return a}function R(a,b){var c=a.getMonth(),d=a.getDate(),e=a.getFullYear(),f=M(a),g=a.getDay(),h=a.getHours(),i=h>=12,j=i?h-12:h,k=N(a),l=a.getMinutes(),m=a.getSeconds(),n=/%./g,o;j===0&&(j=12),o={"%a":L("sdn")[g],"%A":L("dn")[g],"%b":L("smn")[c],"%B":L("mn")[c],"%C":1+Math.floor(e/100),"%d":d<10?"0"+d:d,"%e":d,"%H":h<10?"0"+h:h,"%I":j<10?"0"+j:j,"%j":k<10?"00"+k:k<100?"0"+k:k,"%k":h,"%l":j,"%m":c<9?"0"+(1+c):1+c,"%o":1+c,"%M":l<10?"0"+l:l,"%n":"\n","%p":i?"PM":"AM","%P":i?"pm":"am","%s":Math.floor(a.getTime()/1e3),"%S":m<10?"0"+m:m,"%t":"\t","%U":f<10?"0"+f:f,"%W":f<10?"0"+f:f,"%V":f<10?"0"+f:f,"%u":g+1,"%w":g,"%y":(""+e).substr(2,2),"%Y":e,"%%":"%"};return b.replace(n,function(a){return o.hasOwnProperty(a)?o[a]:a})}function Q(a,b,c){var d=a.getFullYear(),e=a.getMonth(),f=a.getDate(),g=b.getFullYear(),h=b.getMonth(),i=b.getDate();return d<g?-3:d>g?3:e<h?-2:e>h?2:c?0:f<i?-1:f>i?1:0}function P(a,b,c,d,e){if(!(a instanceof Date)){a=parseInt(a,10);var f=Math.floor(a/1e4);a=a%1e4;var g=Math.floor(a/100);a=a%100,a=new Date(f,g-1,a,b==null?12:b,c==null?0:c,d==null?0:d,e==null?0:e)}return a}function O(a){if(a instanceof Date)return 1e4*a.getFullYear()+100*(a.getMonth()+1)+a.getDate();if(typeof a=="string")return parseInt(a,10);return a}function N(a){a=new Date(a.getFullYear(),a.getMonth(),a.getDate(),12,0,0);var b=new Date(a.getFullYear(),0,1,12,0,0),c=a-b;return Math.floor(c/864e5)}function M(a){a=new Date(a.getFullYear(),a.getMonth(),a.getDate(),12,0,0);var b=a.getDay();a.setDate(a.getDate()-(b+6)%7+3);var c=a.valueOf();a.setMonth(0),a.setDate(4);return Math.round((c-a.valueOf())/6048e5)+1}function L(a,b){var c=i.__.data[a];b&&typeof c=="string"&&(c=K(c,b));return c}function K(a,b){return a.replace(/\$\{([^:\}]+)(:[^\}]+)?\}/g,function(a,c,d){var e=b[c],f;d&&(f=d.substr(1).split(/\s*\|\s*/),e=(e>=f.length?f[f.length-1]:f[e]).replace(/##?/g,function(a){return a.length==2?"#":e}));return e})}function J(b){if(!this._menuAnim){b=b||window.event;var c=b.target||b.srcElement,d=c.getAttribute("dyc-btn"),e=b.keyCode,f=b.charCode||e,g=H[e];if("year"==d&&e==13){var h=new Date(this.date);h.setDate(1),h.setFullYear(this._getInputYear()),this.moveTo(h,!0),z(this,!1);return X(b)}if(this._menuVisible){if(e==27){z(this,!1);return X(b)}}else{b.ctrlKey||(g=null),g==null&&!b.ctrlKey&&(g=I[e]),e==36&&(g=0);if(g!=null){y(this,g);return X(b)}f=String.fromCharCode(f).toLowerCase();var i=this.els.yearInput,j=this.selection;if(f==" "){z(this,!0),this.focus(),i.focus(),i.select();return X(b)}if(f>="0"&&f<="9"){z(this,!0),this.focus(),i.value=f,i.focus();return X(b)}var k=L("mn"),l=b.shiftKey?-1:this.date.getMonth(),m=0,n;while(++m<12){n=k[(l+m)%12].toLowerCase();if(n.indexOf(f)==0){var h=new Date(this.date);h.setDate(1),h.setMonth((l+m)%12),this.moveTo(h,!0);return X(b)}}if(e>=37&&e<=40){var h=this._lastHoverDate;if(!h&&!j.isEmpty()){h=e<39?j.getFirstDate():j.getLastDate();if(h<this._firstDateVisible||h>this._lastDateVisible)h=null}if(!h)h=e<39?this._lastDateVisible:this._firstDateVisible;else{var o=h;h=P(h);var l=100;while(l-->0){switch(e){case 37:h.setDate(h.getDate()-1);break;case 38:h.setDate(h.getDate()-7);break;case 39:h.setDate(h.getDate()+1);break;case 40:h.setDate(h.getDate()+7)}if(!this.isDisabled(h))break}h=O(h),(h<this._firstDateVisible||h>this._lastDateVisible)&&this.moveTo(h)}Y(this._getDateDiv(o),Z(this._getDateDiv(h),"DynarchCalendar-hover-date")),this._lastHoverDate=h;return X(b)}if(e==13&&this._lastHoverDate){j.type==a.SEL_MULTIPLE&&(b.shiftKey||b.ctrlKey)?(b.shiftKey&&this._selRangeStart&&(j.clear(!0),j.selectRange(this._selRangeStart,this._lastHoverDate)),b.ctrlKey&&j.set(this._selRangeStart=this._lastHoverDate,!0)):j.reset(this._selRangeStart=this._lastHoverDate);return X(b)}e==27&&!this.args.cont&&this.hide()}}}function G(){this.refresh();var a=this.inputField,b=this.selection;if(a){var c=b.print(this.dateFormat);/input|textarea/i.test(a.tagName)?a.value=c:a.innerHTML=c}this.callHooks("onSelect",this,b)}function F(a){a=a||window.event;var b=C(a);if(b){var c=b.getAttribute("dyc-btn"),d=b.getAttribute("dyc-type"),e=a.wheelDelta?a.wheelDelta/120:-a.detail/3;e=e<0?-1:e>0?1:0,this.args.reverseWheel&&(e=-e);if(/^(time-(hour|min))/.test(d)){switch(RegExp.$1){case"time-hour":this.setHours(this.getHours()+e);break;case"time-min":this.setMinutes(this.getMinutes()+this.args.minuteStep*e)}X(a)}else/Y/i.test(c)&&(e*=2),y(this,-e),X(a)}}function E(a,b){b=b||window.event;var c=C(b);if(c){var d=c.getAttribute("dyc-type");if(d&&!c.getAttribute("disabled"))if(!a||!this._bodyAnim||d!="date"){var e=c.getAttribute("dyc-cls");e=e?D(e,0):"DynarchCalendar-hover-"+d,(d!="date"||this.selection.type)&&$(a,c,e),d=="date"&&($(a,c.parentNode.parentNode,"DynarchCalendar-hover-week"),this._showTooltip(c.getAttribute("dyc-date"))),/^time-hour/.test(d)&&$(a,this.els.timeHour,"DynarchCalendar-hover-time"),/^time-min/.test(d)&&$(a,this.els.timeMinute,"DynarchCalendar-hover-time"),Y(this._getDateDiv(this._lastHoverDate),"DynarchCalendar-hover-date"),this._lastHoverDate=null}}a||this._showTooltip()}function D(a,b){return"DynarchCalendar-"+a.split(/,/)[b]}function C(a){var b=a.target||a.srcElement,c=b;while(b&&b.getAttribute&&!b.getAttribute("dyc-type"))b=b.parentNode;return b.getAttribute&&b||c}function B(a){a=a||window.event;var b=this.els.topCont.style,c=bh(a,this._mouseDiff);b.left=c.x+"px",b.top=c.y+"px"}function A(b,c){c=c||window.event;var d=C(c);if(d&&!d.getAttribute("disabled")){var f=d.getAttribute("dyc-btn"),g=d.getAttribute("dyc-type"),h=d.getAttribute("dyc-date"),i=this.selection,j,k={mouseover:X,mousemove:X,mouseup:function(a){var b=d.getAttribute("dyc-cls");b&&Y(d,D(b,1)),clearTimeout(j),W(document,k,!0),k=null}};if(b){setTimeout(bb(this.focus,this),1);var l=d.getAttribute("dyc-cls");l&&Z(d,D(l,1));if("menu"==f)this.toggleMenu();else if(d&&/^[+-][MY]$/.test(f))if(y(this,f)){var m=bb(function(){y(this,f,!0)?j=setTimeout(m,40):(k.mouseup(),y(this,f))},this);j=setTimeout(m,350),V(document,k,!0)}else k.mouseup();else if("year"==f)this.els.yearInput.focus(),this.els.yearInput.select();else if(g=="time-am")V(document,k,!0);else if(/^time/.test(g)){var m=bb(function(a){w.call(this,a),j=setTimeout(m,100)},this,g);w.call(this,g),j=setTimeout(m,350),V(document,k,!0)}else h&&i.type&&(i.type==a.SEL_MULTIPLE?c.shiftKey&&this._selRangeStart?i.selectRange(this._selRangeStart,h):(!c.ctrlKey&&!i.isSelected(h)&&i.clear(!0),i.set(h,!0),this._selRangeStart=h):(i.set(h),this.moveTo(P(h),2)),d=this._getDateDiv(h),E.call(this,!0,{target:d})),V(document,k,!0);e&&k&&/dbl/i.test(c.type)&&k.mouseup(),!this.args.fixed&&/^(DynarchCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(d.className)&&!this.args.cont&&(k.mousemove=bb(B,this),this._mouseDiff=bh(c,bi(this.els.topCont)),V(document,k,!0))}else if("today"==f)!this._menuVisible&&i.type==a.SEL_SINGLE&&i.set(new Date),this.moveTo(new Date,!0),z(this,!1);else if(/^m([0-9]+)/.test(f)){var h=new Date(this.date);h.setDate(1),h.setMonth(RegExp.$1),h.setFullYear(this._getInputYear()),this.moveTo(h,!0),z(this,!1)}else g=="time-am"&&this.setHours(this.getHours()+12);e||X(c)}}function z(a,b){a._menuVisible=b,$(b,a.els.title,"DynarchCalendar-pressed-title");var c=a.els.menu;f&&(c.style.height=a.els.main.offsetHeight+"px");if(!a.args.animation)bg(c,b),a.focused&&a.focus();else{a._menuAnim&&a._menuAnim.stop();var d=a.els.main.offsetHeight;f&&(c.style.width=a.els.topBar.offsetWidth+"px"),b&&(c.firstChild.style.marginTop=-d+"px",a.args.opacity>0&&bf(c,0),bg(c,!0)),a._menuAnim=bd({onUpdate:function(e,f){c.firstChild.style.marginTop=f(be.accel_b(e),-d,0,!b)+"px",a.args.opacity>0&&bf(c,f(be.accel_b(e),0,.85,!b))},onStop:function(){a.args.opacity>0&&bf(c,.85),c.firstChild.style.marginTop="",a._menuAnim=null,b||(bg(c,!1),a.focused&&a.focus())}})}}function y(a,b,c){this._bodyAnim&&this._bodyAnim.stop();var d;if(b!=0){d=new Date(a.date),d.setDate(1);switch(b){case"-Y":case-2:d.setFullYear(d.getFullYear()-1);break;case"+Y":case 2:d.setFullYear(d.getFullYear()+1);break;case"-M":case-1:d.setMonth(d.getMonth()-1);break;case"+M":case 1:d.setMonth(d.getMonth()+1)}}else d=new Date;return a.moveTo(d,!c)}function w(a){switch(a){case"time-hour+":this.setHours(this.getHours()+1);break;case"time-hour-":this.setHours(this.getHours()-1);break;case"time-min+":this.setMinutes(this.getMinutes()+this.args.minuteStep);break;case"time-min-":this.setMinutes(this.getMinutes()-this.args.minuteStep);break;default:return}}function v(){this._bluringTimeout=setTimeout(bb(u,this),50)}function u(){this.focused=!1,Y(this.els.main,"DynarchCalendar-focused"),this._menuVisible&&z(this,!1),this.args.cont||this.hide(),this.callHooks("onBlur",this)}function t(){this._bluringTimeout&&clearTimeout(this._bluringTimeout),this.focused=!0,Z(this.els.main,"DynarchCalendar-focused"),this.callHooks("onFocus",this)}function s(a){var b=_("div"),c=a.els={},d={mousedown:bb(A,a,!0),mouseup:bb(A,a,!1),mouseover:bb(E,a,!0),mouseout:bb(E,a,!1),keypress:bb(J,a)};a.args.noScroll||(d[g?"DOMMouseScroll":"mousewheel"]=bb(F,a)),e&&(d.dblclick=d.mousedown,d.keydown=d.keypress),b.innerHTML=m(a),bc(b.firstChild,function(a){var b=r[a.className];b&&(c[b]=a),e&&a.setAttribute("unselectable","on")}),V(c.main,d),V([c.focusLink,c.yearInput],a._focusEvents={focus:bb(t,a),blur:bb(v,a)}),a.moveTo(a.date,!1),a.setTime(null,!0);return c.topCont}function q(a){function d(){c.showTime&&(b.push("<td>"),p(a,b),b.push("</td>"))}var b=[],c=a.args;b.push("<table",j," style='width:100%'><tr>"),c.timePos=="left"&&d(),c.bottomBar&&(b.push("<td>"),b.push("<table",j,"><tr><td>","<div dyc-btn='today' dyc-cls='hover-bottomBar-today,pressed-bottomBar-today' dyc-type='bottomBar-today' ","class='DynarchCalendar-bottomBar-today'>",L("today"),"</div>","</td></tr></table>"),b.push("</td>")),c.timePos=="right"&&d(),b.push("</tr></table>");return b.join("")}function p(a,b){b.push("<table class='DynarchCalendar-time'"+j+"><tr>","<td rowspan='2'><div dyc-type='time-hour' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-hour'></div></td>","<td dyc-type='time-hour+' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-up'></td>","<td rowspan='2' class='DynarchCalendar-time-sep'></td>","<td rowspan='2'><div dyc-type='time-min' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-minute'></div></td>","<td dyc-type='time-min+' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-up'></td>"),a.args.showTime==12&&b.push("<td rowspan='2' class='DynarchCalendar-time-sep'></td>","<td rowspan='2'><div class='DynarchCalendar-time-am' dyc-type='time-am' dyc-cls='hover-time,pressed-time'></div></td>"),b.push("</tr><tr>","<td dyc-type='time-hour-' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-down'></td>","<td dyc-type='time-min-' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-down'></td>","</tr></table>")}function o(a){var b=["<table height='100%'",j,"><tr><td>","<table style='margin-top: 1.5em'",j,">","<tr><td colspan='3'><input dyc-btn='year' class='DynarchCalendar-menu-year' size='6' value='",a.date.getFullYear(),"' /></td></tr>","<tr><td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='today'>",L("goToday"),"</div></td></tr>","</table>","<p class='DynarchCalendar-menu-sep'>&nbsp;</p>","<table class='DynarchCalendar-menu-mtable'",j,">"],c=L("smn"),d=0,e=b.length,f;while(d<12){b[e++]="<tr>";for(f=4;--f>0;)b[e++]="<td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='m"+d+"' class='DynarchCalendar-menu-month'>"+c[d++]+"</div></td>";b[e++]="</tr>"}b[e++]="</table></td></tr></table>";return b.join("")}function n(a){return"<div unselectable='on'>"+R(a.date,a.args.titleFormat)+"</div>"}function m(a){var b=["<table class='DynarchCalendar-topCont'",j,"><tr><td>","<div class='DynarchCalendar'>",e?"<a class='DynarchCalendar-focusLink' href='#'></a>":"<button class='DynarchCalendar-focusLink'></button>","<div class='DynarchCalendar-topBar'>","<div dyc-type='nav' dyc-btn='-Y' dyc-cls='hover-navBtn,pressed-navBtn' ","class='DynarchCalendar-navBtn DynarchCalendar-prevYear'><div></div></div>","<div dyc-type='nav' dyc-btn='+Y' dyc-cls='hover-navBtn,pressed-navBtn' ","class='DynarchCalendar-navBtn DynarchCalendar-nextYear'><div></div></div>","<div dyc-type='nav' dyc-btn='-M' dyc-cls='hover-navBtn,pressed-navBtn' ","class='DynarchCalendar-navBtn DynarchCalendar-prevMonth'><div></div></div>","<div dyc-type='nav' dyc-btn='+M' dyc-cls='hover-navBtn,pressed-navBtn' ","class='DynarchCalendar-navBtn DynarchCalendar-nextMonth'><div></div></div>","<table class='DynarchCalendar-titleCont'",j,"><tr><td>","<div dyc-type='title' dyc-btn='menu' dyc-cls='hover-title,pressed-title' class='DynarchCalendar-title'>",n(a),"</div></td></tr></table>","<div class='DynarchCalendar-dayNames'>",k(a),"</div>","</div>","<div class='DynarchCalendar-body'></div>"];(a.args.bottomBar||a.args.showTime)&&b.push("<div class='DynarchCalendar-bottomBar'>",q(a),"</div>"),b.push("<div class='DynarchCalendar-menu' style='display: none'>",o(a),"</div>","<div class='DynarchCalendar-tooltip'></div>","</div>","</td></tr></table>");return b.join("")}function l(a,b,c){b=b||a.date,c=c||a.fdow,b=new Date(b.getFullYear(),b.getMonth(),b.getDate(),12,0,0,0);var d=b.getMonth(),e=[],f=0,g=a.args.weekNumbers;b.setDate(1);var h=(b.getDay()-c)%7;h<0&&(h+=7),b.setDate(0-h),b.setDate(b.getDate()+1);var i=new Date,k=i.getDate(),l=i.getMonth(),m=i.getFullYear();e[f++]="<table class='DynarchCalendar-bodyTable'"+j+">";for(var n=0;n<6;++n){e[f++]="<tr class='DynarchCalendar-week",n==0&&(e[f++]=" DynarchCalendar-first-row"),n==5&&(e[f++]=" DynarchCalendar-last-row"),e[f++]="'>",g&&(e[f++]="<td class='DynarchCalendar-first-col'><div class='DynarchCalendar-weekNumber'>"+M(b)+"</div></td>");for(var o=0;o<7;++o){var p=b.getDate(),q=b.getMonth(),r=b.getFullYear(),s=1e4*r+100*(q+1)+p,t=a.selection.isSelected(s),u=a.isDisabled(b);e[f++]="<td class='",o==0&&!g&&(e[f++]=" DynarchCalendar-first-col"),o==0&&n==0&&(a._firstDateVisible=s),o==6&&(e[f++]=" DynarchCalendar-last-col",n==5&&(a._lastDateVisible=s)),t&&(e[f++]=" DynarchCalendar-td-selected"),e[f++]="'><div dyc-type='date' unselectable='on' dyc-date='"+s+"' ",u&&(e[f++]="disabled='1' "),e[f++]="class='DynarchCalendar-day",L("weekend").indexOf(b.getDay())>=0&&(e[f++]=" DynarchCalendar-weekend"),q!=d&&(e[f++]=" DynarchCalendar-day-othermonth"),p==k&&q==l&&r==m&&(e[f++]=" DynarchCalendar-day-today"),u&&(e[f++]=" DynarchCalendar-day-disabled"),t&&(e[f++]=" DynarchCalendar-day-selected"),u=a.args.dateInfo(b),u&&u.klass&&(e[f++]=" "+u.klass),e[f++]="'>"+p+"</div></td>",b=new Date(r,q,p+1,12,0,0,0)}e[f++]="</tr>"}e[f++]="</table>";return e.join("")}function k(a){var b=["<table",j,"><tr>"],c=0;a.args.weekNumbers&&b.push("<td><div class='DynarchCalendar-weekNumber'>",L("wk"),"</div></td>");while(c<7){var d=(c++ +a.fdow)%7;b.push("<td><div",L("weekend").indexOf(d)>=0?" class='DynarchCalendar-weekend'>":">",L("sdn")[d],"</div></td>")}b.push("</tr></table>");return b.join("")}function a(b){b=b||{},this.args=b=U(b,{animation:!f,cont:null,bottomBar:!0,date:!0,fdow:L("fdow"),min:null,max:null,reverseWheel:!1,selection:[],selectionType:a.SEL_SINGLE,weekNumbers:!1,align:"Bl/ / /T/r",inputField:null,trigger:null,dateFormat:"%Y-%m-%d",fixed:!1,opacity:e?1:3,titleFormat:"%b %Y",showTime:!1,timePos:"right",time:!0,minuteStep:5,noScroll:!1,disabled:bl,checkRange:!1,dateInfo:bl,onChange:bl,onSelect:bl,onTimeChange:bl,onFocus:bl,onBlur:bl}),this.handlers={};var c=this,d=new Date;b.min=S(b.min),b.max=S(b.max),b.date===!0&&(b.date=d),b.time===!0&&(b.time=d.getHours()*100+Math.floor(d.getMinutes()/b.minuteStep)*b.minuteStep),this.date=S(b.date),this.time=b.time,this.fdow=b.fdow,bk("onChange onSelect onTimeChange onFocus onBlur".split(/\s+/),function(a){var d=b[a];d instanceof Array||(d=[d]),c.handlers[a]=d}),this.selection=new a.Selection(b.selection,b.selectionType,G,this);var g=s(this);b.cont&&bm(b.cont).appendChild(g),b.trigger&&this.manageFields(b.trigger,b.inputField,b.dateFormat)}var b=navigator.userAgent,c=/opera/i.test(b),d=/Konqueror|Safari|KHTML/i.test(b),e=/msie/i.test(b)&&!c&&!/mac_powerpc/i.test(b),f=e&&/msie 6/i.test(b),g=/gecko/i.test(b)&&!d&&!c&&!e,h=a.prototype,i=a.I18N={};a.SEL_NONE=0,a.SEL_SINGLE=1,a.SEL_MULTIPLE=2,a.SEL_WEEK=3,a.dateToInt=O,a.intToDate=P,a.printDate=R,a.formatString=K,a.i18n=L,a.LANG=function(a,b,c){i.__=i[a]={name:b,data:c}},a.setup=function(b){return new a(b)},h.moveTo=function(a,b){var c=this;a=S(a);var d=Q(a,c.date,!0),e,f=c.args,g=f.min&&Q(a,f.min),h=f.max&&Q(a,f.max);f.animation||(b=!1),$(g!=null&&g<=1,[c.els.navPrevMonth,c.els.navPrevYear],"DynarchCalendar-navDisabled"),$(h!=null&&h>=-1,[c.els.navNextMonth,c.els.navNextYear],"DynarchCalendar-navDisabled"),g<-1&&(a=f.min,e=1,d=0),h>1&&(a=f.max,e=2,d=0),c.date=a,c.refresh(!!b),c.callHooks("onChange",c,a,b);if(b&&(d!=0||b!=2)){c._bodyAnim&&c._bodyAnim.stop();var i=c.els.body,j=_("div","DynarchCalendar-animBody-"+x[d],i),k=i.firstChild,m=bf(k)||.7,n=e?be.brakes:d==0?be.shake:be.accel_ab2,o=d*d>4,p=o?k.offsetTop:k.offsetLeft,q=j.style,r=o?i.offsetHeight:i.offsetWidth;d<0?r+=p:d>0?r=p-r:(r=Math.round(r/7),e==2&&(r=-r));if(!e&&d!=0){var s=j.cloneNode(!0),t=s.style,u=2*r;s.appendChild(k.cloneNode(!0)),t[o?"marginTop":"marginLeft"]=r+"px",i.appendChild(s)}k.style.visibility="hidden",j.innerHTML=l(c),c._bodyAnim=bd({onUpdate:function(a,b){var f=n(a);if(s)var g=b(f,r,u)+"px";if(e)q[o?"marginTop":"marginLeft"]=b(f,r,0)+"px";else{if(o||d==0)q.marginTop=b(d==0?n(a*a):f,0,r)+"px",d!=0&&(t.marginTop=g);if(!o||d==0)q.marginLeft=b(f,0,r)+"px",d!=0&&(t.marginLeft=g)}c.args.opacity>2&&s&&(bf(s,1-f),bf(j,f))},onStop:function(b){i.innerHTML=l(c,a),c._bodyAnim=null}})}c._lastHoverDate=null;return g>=-1&&h<=1},h.isDisabled=function(a){var b=this.args;return b.min&&Q(a,b.min)<0||b.max&&Q(a,b.max)>0||b.disabled(a)},h.toggleMenu=function(){z(this,!this._menuVisible)},h.refresh=function(a){var b=this.els;a||(b.body.innerHTML=l(this)),b.title.innerHTML=n(this),b.yearInput.value=this.date.getFullYear()},h.redraw=function(){var a=this,b=a.els;a.refresh(),b.dayNames.innerHTML=k(a),b.menu.innerHTML=o(a),b.bottomBar&&(b.bottomBar.innerHTML=q(a)),bc(b.topCont,function(c){var d=r[c.className];d&&(b[d]=c),c.className=="DynarchCalendar-menu-year"?(V(c,a._focusEvents),b.yearInput=c):e&&c.setAttribute("unselectable","on")}),a.setTime(null,!0)},h.setLanguage=function(b){var c=a.setLanguage(b);c&&(this.fdow=c.data.fdow,this.redraw())},a.setLanguage=function(a){var b=i[a];b&&(i.__=b);return b},h.focus=function(){try{this.els[this._menuVisible?"yearInput":"focusLink"].focus()}catch(a){}t.call(this)},h.blur=function(){this.els.focusLink.blur(),this.els.yearInput.blur(),u.call(this)},h.showAt=function(a,b,c){this._showAnim&&this._showAnim.stop(),c=c&&this.args.animation;var d=this.els.topCont,e=this,f=this.els.body.firstChild,g=f.offsetHeight,h=d.style;h.position="absolute",h.left=a+"px",h.top=b+"px",h.zIndex=1e4,h.display="",c&&(f.style.marginTop=-g+"px",this.args.opacity>1&&bf(d,0),this._showAnim=bd({onUpdate:function(a,b){f.style.marginTop=-b(be.accel_b(a),g,0)+"px",e.args.opacity>1&&bf(d,a)},onStop:function(){e.args.opacity>1&&bf(d,""),e._showAnim=null}}))},h.hide=function(){var a=this.els.topCont,b=this,c=this.els.body.firstChild,d=c.offsetHeight,e=bi(a).y;this.args.animation?(this._showAnim&&this._showAnim.stop(),this._showAnim=bd({onUpdate:function(f,g){b.args.opacity>1&&bf(a,1-f),c.style.marginTop=-g(be.accel_b(f),0,d)+"px",a.style.top=g(be.accel_ab(f),e,e-10)+"px"},onStop:function(){a.style.display="none",c.style.marginTop="",b.args.opacity>1&&bf(a,""),b._showAnim=null}})):a.style.display="none",this.inputField=null},h.popup=function(a,b){function h(b){var c={x:i.x,y:i.y};if(!b)return c;/B/.test(b)&&(c.y+=a.offsetHeight),/b/.test(b)&&(c.y+=a.offsetHeight-f.y),/T/.test(b)&&(c.y-=f.y),/l/.test(b)&&(c.x-=f.x-a.offsetWidth),/L/.test(b)&&(c.x-=f.x),/R/.test(b)&&(c.x+=a.offsetWidth),/c/i.test(b)&&(c.x+=(a.offsetWidth-f.x)/2),/m/i.test(b)&&(c.y+=(a.offsetHeight-f.y)/2);return c}a=bm(a),b||(b=this.args.align),b=b.split(/\x2f/);var c=bi(a),d=this.els.topCont,e=d.style,f,g=bj();e.visibility="hidden",e.display="",this.showAt(0,0),document.body.appendChild(d),f={x:d.offsetWidth,y:d.offsetHeight};var i=c;i=h(b[0]),i.y<g.y&&(i.y=c.y,i=h(b[1])),i.x+f.x>g.x+g.w&&(i.x=c.x,i=h(b[2])),i.y+f.y>g.y+g.h&&(i.y=c.y,i=h(b[3])),i.x<g.x&&(i.x=c.x,i=h(b[4])),this.showAt(i.x,i.y,!0),e.visibility="",this.focus()},h.manageFields=function(b,c,d){var e=this;c=bm(c),b=bm(b),/^button$/i.test(b.tagName)&&b.setAttribute("type","button"),V(b,"click",function(){e.inputField=c,e.dateFormat=d;if(e.selection.type==a.SEL_SINGLE){var f,g,h,i;f=/input|textarea/i.test(c.tagName)?c.value:c.innerText||c.textContent,f&&(g=/(^|[^%])%[bBmo]/.exec(d),h=/(^|[^%])%[de]/.exec(d),g&&h&&(i=g.index<h.index),f=Calendar.parseDate(f,i),f&&(e.selection.set(f,!1,!0),e.args.showTime&&(e.setHours(f.getHours()),e.setMinutes(f.getMinutes())),e.moveTo(f)))}e.popup(b)})},h.callHooks=function(a){var b=ba(arguments,1),c=this.handlers[a],d=0;for(;d<c.length;++d)c[d].apply(this,b)},h.addEventListener=function(a,b){this.handlers[a].push(b)},h.removeEventListener=function(a,b){var c=this.handlers[a],d=c.length;while(--d>=0)c[d]===b&&c.splice(d,1)},h.getTime=function(){return this.time},h.setTime=function(a,b){if(this.args.showTime){a=a!=null?a:this.time,this.time=a;var c=this.getHours(),d=this.getMinutes(),e=c<12;this.args.showTime==12&&(c==0&&(c=12),c>12&&(c-=12),this.els.timeAM.innerHTML=L(e?"AM":"PM")),c<10&&(c="0"+c),d<10&&(d="0"+d),this.els.timeHour.innerHTML=c,this.els.timeMinute.innerHTML=d,b||this.callHooks("onTimeChange",this,a)}},h.getHours=function(){return Math.floor(this.time/100)},h.getMinutes=function(){return this.time%100},h.setHours=function(a){a<0&&(a+=24),this.setTime(100*(a%24)+this.time%100)},h.setMinutes=function(a){a<0&&(a+=60),a=Math.floor(a/this.args.minuteStep)*this.args.minuteStep,this.setTime(100*this.getHours()+a%60)},h._getInputYear=function(){var a=parseInt(this.els.yearInput.value,10);isNaN(a)&&(a=this.date.getFullYear());return a},h._showTooltip=function(a){var b="",c,d=this.els.tooltip;a&&(a=P(a),c=this.args.dateInfo(a),c&&c.tooltip&&(b="<div class='DynarchCalendar-tooltipCont'>"+R(a,c.tooltip)+"</div>")),d.innerHTML=b};var j=" align='center' cellspacing='0' cellpadding='0'",r={"DynarchCalendar-topCont":"topCont","DynarchCalendar-focusLink":"focusLink",DynarchCalendar:"main","DynarchCalendar-topBar":"topBar","DynarchCalendar-title":"title","DynarchCalendar-dayNames":"dayNames","DynarchCalendar-body":"body","DynarchCalendar-menu":"menu","DynarchCalendar-menu-year":"yearInput","DynarchCalendar-bottomBar":"bottomBar","DynarchCalendar-tooltip":"tooltip","DynarchCalendar-time-hour":"timeHour","DynarchCalendar-time-minute":"timeMinute","DynarchCalendar-time-am":"timeAM","DynarchCalendar-navBtn DynarchCalendar-prevYear":"navPrevYear","DynarchCalendar-navBtn DynarchCalendar-nextYear":"navNextYear","DynarchCalendar-navBtn DynarchCalendar-prevMonth":"navPrevMonth","DynarchCalendar-navBtn DynarchCalendar-nextMonth":"navNextMonth"},x={"-3":"backYear","-2":"back",0:"now",2:"fwd",3:"fwdYear"},H={37:-1,38:-2,39:1,40:2},I={33:-1,34:1};h._getDateDiv=function(a){var b=null;if(a)try{bc(this.els.body,function(c){if(c.getAttribute("dyc-date")==a)throw b=c})}catch(c){}return b},(a.Selection=function(a,b,c,d){this.type=b,this.sel=a instanceof Array?a:[a],this.onChange=bb(c,d),this.cal=d}).prototype={get:function(){return this.type==a.SEL_SINGLE?this.sel[0]:this.sel},isEmpty:function(){return this.sel.length==0},set:function(b,c,d){var e=this.type==a.SEL_SINGLE;b instanceof Array?(this.sel=b,this.normalize(),d||this.onChange(this)):(b=O(b),e||!this.isSelected(b)?(e?this.sel=[b]:this.sel.splice(this.findInsertPos(b),0,b),this.normalize(),d||this.onChange(this)):c&&this.unselect(b,d))},reset:function(){this.sel=[],this.set.apply(this,arguments)},countDays:function(){var a=0,b=this.sel,c=b.length,d,e,f;while(--c>=0)d=b[c],d instanceof Array&&(e=P(d[0]),f=P(d[1]),a+=Math.round(Math.abs(f.getTime()-e.getTime())/864e5)),++a;return a},unselect:function(a,b){a=O(a);var c=!1;for(var d=this.sel,e=d.length,f;--e>=0;){f=d[e];if(f instanceof Array){if(a>=f[0]&&a<=f[1]){var g=P(a),h=g.getDate();if(a==f[0])g.setDate(h+1),f[0]=O(g),c=!0;else if(a==f[1])g.setDate(h-1),f[1]=O(g),c=!0;else{var i=new Date(g);i.setDate(h+1),g.setDate(h-1),d.splice(e+1,0,[O(i),f[1]]),f[1]=O(g),c=!0}}}else a==f&&(d.splice(e,1),c=!0)}c&&(this.normalize(),b||this.onChange(this))},normalize:function(){this.sel=this.sel.sort(function(a,b){a instanceof Array&&(a=a[0]),b instanceof Array&&(b=b[0]);return a-b});for(var a=this.sel,b=a.length,c,d;--b>=0;){c=a[b];if(c instanceof Array){if(c[0]>c[1]){a.splice(b,1);continue}c[0]==c[1]&&(c=a[b]=c[0])}if(d){var e=d,f=c instanceof Array?c[1]:c;f=P(f),f.setDate(f.getDate()+1),f=O(f);if(f>=e){var g=a[b+1];c instanceof Array&&g instanceof Array?(c[1]=g[1],a.splice(b+1,1)):c instanceof Array?(c[1]=d,a.splice(b+1,1)):g instanceof Array?(g[0]=c,a.splice(b,1)):(a[b]=[c,g],a.splice(b+1,1))}}d=c instanceof Array?c[0]:c}},findInsertPos:function(a){for(var b=this.sel,c=b.length,d;--c>=0;){d=b[c],d instanceof Array&&(d=d[0]);if(d<=a)break}return c+1},clear:function(a){this.sel=[],a||this.onChange(this)},selectRange:function(b,c){b=O(b),c=O(c);if(b>c){var d=b;b=c,c=d}var e=this.cal.args.checkRange;if(!e)return this._do_selectRange(b,c);try{bk((new a.Selection([[b,c]],a.SEL_MULTIPLE,bl)).getDates(),bb(function(a){if(this.isDisabled(a)){e instanceof Function&&e(a,this);throw"OUT"}},this.cal)),this._do_selectRange(b,c)}catch(f){}},_do_selectRange:function(a,b){this.sel.push([a,b]),this.normalize(),this.onChange(this)},isSelected:function(a){for(var b=this.sel.length,c;--b>=0;){c=this.sel[b];if(c instanceof Array&&a>=c[0]&&a<=c[1]||a==c)return!0}return!1},getFirstDate:function(){var a=this.sel[0];a&&a instanceof Array&&(a=a[0]);return a},getLastDate:function(){if(this.sel.length>0){var a=this.sel[this.sel.length-1];a&&a instanceof Array&&(a=a[1]);return a}},print:function(a,b){var c=[],d=0,e,f=this.cal.getHours(),g=this.cal.getMinutes();b||(b=" -> ");while(d<this.sel.length)e=this.sel[d++],e instanceof Array?c.push(R(P(e[0],f,g),a)+b+R(P(e[1],f,g),a)):c.push(R(P(e,f,g),a));return c},getDates:function(a){var b=[],c=0,d,e;while(c<this.sel.length){e=this.sel[c++];if(e instanceof Array){d=P(e[0]),e=e[1];while(O(d)<e)b.push(a?R(d,a):new Date(d)),d.setDate(d.getDate()+1)}else d=P(e);b.push(a?R(d,a):d)}return b}},a.isUnicodeLetter=function(a){return a.toUpperCase()!=a.toLowerCase()},a.parseDate=function(b,c,d){if(!/\S/.test(b))return"";b=b.replace(/^\s+/,"").replace(/\s+$/,""),d=d||new Date;var e=null,f=null,g=null,h=null,i=null,j=null,k=b.match(/([0-9]{1,2}):([0-9]{1,2})(:[0-9]{1,2})?\s*(am|pm)?/i);k&&(h=parseInt(k[1],10),i=parseInt(k[2],10),j=k[3]?parseInt(k[3].substr(1),10):0,b=b.substring(0,k.index)+b.substr(k.index+k[0].length),k[4]&&(k[4].toLowerCase()=="pm"&&h<12?h+=12:k[4].toLowerCase()=="am"&&h>=12&&(h-=12)));var l=function(){function k(a){d.push(a)}function j(){var a="";while(g()&&/[0-9]/.test(g()))a+=f();if(h(g()))return i(a);return parseInt(a,10)}function i(a){while(g()&&h(g()))a+=f();return a}function g(){return b.charAt(c)}function f(){return b.charAt(c++)}var c=0,d=[],e,h=a.isUnicodeLetter;while(c<b.length)e=g(),h(e)?k(i("")):/[0-9]/.test(e)?k(j()):f();return d}(),m=[];for(var n=0;n<l.length;++n){var o=l[n];/^[0-9]{4}$/.test(o)?(e=parseInt(o,10),f==null&&g==null&&c==null&&(c=!0)):/^[0-9]{1,2}$/.test(o)?(o=parseInt(o,10),o<60?o<0||o>12?o>=1&&o<=31&&(g=o):m.push(o):e=o):f==null&&(f=T(o))}m.length<2?m.length==1&&(g==null?g=m.shift():f==null&&(f=m.shift())):c?(f==null&&(f=m.shift()),g==null&&(g=m.shift())):(g==null&&(g=m.shift()),f==null&&(f=m.shift())),e==null&&(e=m.length>0?m.shift():d.getFullYear()),e<30?e+=2e3:e<99&&(e+=1900),f==null&&(f=d.getMonth()+1);return e!=null&&f!=null&&g!=null?new Date(e,f-1,g,h,i,j):null};var be={elastic_b:function(a){return 1-Math.cos(-a*5.5*Math.PI)/Math.pow(2,7*a)},magnetic:function(a){return 1-Math.cos(a*a*a*10.5*Math.PI)/Math.exp(4*a)},accel_b:function(a){a=1-a;return 1-a*a*a*a},accel_a:function(a){return a*a*a},accel_ab:function(a){a=1-a;return 1-Math.sin(a*a*Math.PI/2)},accel_ab2:function(a){return(a/=.5)<1?.5*a*a:-0.5*(--a*(a-2)-1)},brakes:function(a){a=1-a;return 1-Math.sin(a*a*Math.PI)},shake:function(a){return a<.5?-Math.cos(a*11*Math.PI)*a*a:(a=1-a,Math.cos(a*11*Math.PI)*a*a)}},bl=new Function;return a}()
															
Calendar.LANG("cn", "中文", {
    fdow: 0,                // first day of week for this locale; 0 = Sunday, 1 = Monday, etc.
    goToday: "今天",
    today: "今天",         // appears in bottom bar
    wk: "周",
    weekend: "0,6",         // 0 = Sunday, 1 = Monday, etc.
    AM: "AM", PM: "PM",
    mn : [ "一月", "二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
    smn : [ "一月", "二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
    dn : [ "日", "一", "二", "三","四","五","六", "日" ],
    sdn : [ "日", "一", "二", "三","四","五","六", "日" ]
});
