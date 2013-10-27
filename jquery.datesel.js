;(function($){
	$.fn.datesel = function(conf){
		conf = $.extend({
			formatDate:'y-m-d',
			formatTime:'h:i',
			minuteStep:5,
			className:'form-control',
			week:true,
			weekName:new Array('日','月','火','水','木','金','土')
		},conf);

		var forms={},
		now=new Date(),
		nowY=now.getFullYear(),
		nowM=now.getMonth()+1,
		nowD=now.getDate(),
		nowH=now.getHours(),
		nowI=now.getMinutes();

		var normalize=function(str){
			return str.replace(/[Ａ-Ｚａ-ｚ０-９－／　]/g, function(s){
				return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
			});
		};

		var dec=function(dt,max){
			if(!dt || 'string'!=typeof(dt)){
				return false;
			}

			dt=dt.replace(/[Ａ-Ｚａ-ｚ０-９－／　]/g, function(s){
				return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
			});

			if(dt.match(/^(2\d{3})([\/-]|年)$/)){
				var y=Number(RegExp.$1);
				var m=(!max) ? 1 : 12;
				var d=(!max) ? 1 : (new Date(y,m,0)).getDate();
				return {
					date:(new Date(y,(m-1),d,0,0,0)),
					string:y+'/'+(('0'+m).slice(-2))+'/'+(('0'+m).slice(-2))
				};
			}else if(dt.match(/^(2\d{3})([\/-]|年)?(\d{1,2})([\/-]|月)?$/)){
				var y=Number(RegExp.$1);
				var m=Number(RegExp.$3);
				var d=(!max) ? 1 : (new Date(y,m,0)).getDate();
				return {
					date:(new Date(y,(m-1),d,0,0,0)),
					string:y+'/'+(('0'+m).slice(-2))+'/'+(('0'+m).slice(-2))
				};
			}

			if(String(dt)[0]=='1' && (dt.length==10 || dt.length==13)){
				dt=(dt.length==10) ? Number(dt+'000') : Number(dt);
				date=new Date(dt);
				yy=date.getFullYear();
				mm=('0'+(date.getMonth()+1)).slice(-2);
				dd=('0'+(date.getDate())).slice(-2);
				hh=('0'+(date.getHours())).slice(-2);
				ii=('0'+(date.getMinutes())).slice(-2);
				str=yy+'/'+mm+'/'+dd+' '+hh+':'+ii;
			}else if(r=dt.match(/(2\d{3})([\/-]|年)?(\d{1,2})([\/-]|月)?(\d{1,2})/)){
				var y,m,d,h,i,date,str;
				y=Number(r[1]),m=Number(r[3]),d=Number(r[5]);
				if(m>=1 && m<=12 && d>=1 && d<=31){
					str=y+'/'+(('0'+m).slice(-2))+'/'+(('0'+d).slice(-2));
					if(r=dt.match(/ ?(\d{1,2})(\:|時)(\d{1,2})/)){
						h=Number(r[1]),i=Number(r[3]);
						if(h>=0 && h<=24 && i>=0 && i<=59){
							str+=' '+(('0'+h).slice(-2))+':'+(('0'+i).slice(-2));
							date=(new Date(y,(m-1),d,h,i,0));
						}
					}else{
						str+=' 00:00';
						date=(new Date(y,(m-1),d,0,0,0));
					}
				}
			}

			if(date){
				return {date:date,string:str};
			}
			return false;
		};

		var oY=(function(){
			var html='<select class="'+conf.className+'">';
			html+='<option value="">年</option>';
			for(var i=nowY-3,l=nowY+1;i<l;i++){
				html+='<option value="'+i+'">'+i+'年</option>';
			}
			html+='</select>';
			return $(html);
		})(),

		oM=(function(){
			var html='<select class="'+conf.className+'">';
			html+='<option value="">月</option>';
			for(var i=1,l=12;i<l;i++){
				html+='<option value="'+i+'">'+((' '+i).slice(-2))+'月</option>';
			}
			html+='</select>';
			return $(html);
		})(),

		oD=(function(){
			var html='<select class="'+conf.className+'">';
			html+='<option value="">日</option>';
			if(conf.week && conf.weekName){
				var wk=conf.weekName;
				for(var i=1,l=(new Date(nowY,nowM,0)).getDate();i<=l;i++){
					var w=wk[(new Date(nowY,nowM-1,i)).getDay()];
					html+='<option value="'+i+'">'+((' '+i).slice(-2))+'日('+w+')</option>';
				}
			}else{
				for(var i=1,l=(new Date(nowY,nowM,0)).getDate();i<=l;i++){
					html+='<option value="'+i+'">'+((' '+i).slice(-2))+'日</option>';
				}
			}
			html+='</select>';
			return $(html);
		})(),

		oH=(function(){
			var html='<select class="'+conf.className+'">';
			html+='<option value="">時</option>';
			for(var i=0,l=23;i<=l;i++){
				html+='<option value="'+i+'">'+((' '+i).slice(-2))+'時</option>';
			}
			html+='</select>';
			return $(html);
		})(),

		oI=(function(){
			var step=conf.minuteStep,html='<select class="'+conf.className+'">';
			html+='<option value="">分</option>';
			for(var i=0,l=59;i<=l;i=i+step){
				html+='<option value="'+i+'">'+(('0'+i).slice(-2))+'分</option>';
			}
			html+='</select>';
			return $(html);
		})();

		var getCurrent=function(t){
			var y,m,d,h,i,v,data=t.data(),ret={y:null,m:null,d:null,h:null,i:null};
			if(data.y){
				v=data.y.val();
				if(v){
					ret.y=v;
				}
			}
			if(data.m){
				v=data.m.val();
				if(v){
					ret.m=v;
				}
			}
			if(data.d){
				v=data.d.val();
				if(v){
					ret.d=v;
				}
			}
			if(data.h){
				v=data.h.val();
				if(v){
					ret.h=v;
				}
			}
			if(data.i){
				v=data.i.val();
				if(v){
					ret.i=v;
				}
			}
			return ret;
		},

		setValue=function(t){
			var ret,key,data=t.data(),
			current=getCurrent(t);
			for(key in current){
				if(current[key]){
					if(!ret){
						ret={};
					}
					if('y'==key){
						ret[key]=current[key];
					}else{
						ret[key]=(('0'+current[key]).slice(-2));
					}
				}
			}

			if(ret.y && ret.m && ret.d){
				var f=data.formatDate;
				var r=f.replace('y',ret.y).replace('m',ret.m).replace('d',ret.d);
				if(data.formatTime && ret.h && ret.i){
					r+=' '+data.formatTime.replace('h',ret.h).replace('i',ret.i);
				}
				t.val(r);
			}else{
				t.val('');
			}
		};

		var setY=function(t,selected){
			var min,max,html='',o=t.data('y');
			if(!selected){
				selected=o.val();
			}
			if(!t.data('min')){
				min=nowY-3;
			}else{
				min=t.data('min').date.getFullYear();
			}
			if(!t.data('max')){
				max=nowY+1;
			}else{
				max=t.data('max').date.getFullYear();
			}

			html+='<option value="">年</option>';
			for(var i=min,l=max;i<=l;i++){
				var s=(selected==i ? ' selected="selected"' : '');
				html+='<option value="'+i+'"'+s+'>'+i+'年</option>';
			}
			o.html(html);
		},

		setM=function(t,selected){
			var min,max,html='',dat,dY,o=t.data('m'),
			current=getCurrent(t);
			if(!selected){
				selected=o.val();
			}
			if(!t.data('min')){
				min=1;
			}else{
				dat=t.data('min').date,
				dY=dat.getFullYear();
				if(current){
					if(current.y<dY){
						min=13;
						selected=null;
						o.val('');
						t.data('d').val('');
					}else if(current.y==dY){
						min=dat.getMonth()+1;
					}
				}
			}
			if(!t.data('max')){
				max=12;
			}else{
				dat=t.data('max').date,
				dY=dat.getFullYear();
				if(current){
					if(current.y>dY){
						max=0;
						selected=null;
						o.val('');
						t.data('d').val('');
					}else if(current.y==dY){
						max=dat.getMonth()+1;
					}
				}
			}

			html+='<option value="">月</option>';
			for(var i=1,l=12;i<=l;i++){
				var s=(selected==i ? ' selected="selected"' : '');
				var d=(i<min || i>max ? ' disabled="disabled"' : '');
				html+='<option value="'+i+'"'+s+''+d+'>'+((' '+i).slice(-2))+'月</option>';
			}
			o.html(html);
		},

		setD=function(t,selected){
			var min,max,html='',dat,dY,dM,o=t.data('d'),
			current=getCurrent(t),
			len=31,
			tY=nowY,
			tM=nowM;

			if(current){
				len=(new Date(current.y,current.m,0)).getDate();
				tY=current.y;
				tM=current.m;
			}

			if(!selected){
				selected=o.val();
			}
			if(selected>len){
				selected=len;
			}
			if(!t.data('min')){
				min=1;
			}else{
				dat=t.data('min').date,
				dY=dat.getFullYear(),
				dM=dat.getMonth()+1;
				if(current){
					if(current.y<dY && current.m<dM){
						min=60;
						selected=null;
						o.val('');
					}else if(current.y==dY && current.m==dM){
						min=dat.getDate();
						if(current.d<min){
							selected=null;
							o.val('');
						}
					}
				}
			}
			if(!t.data('max')){
				max=len;
			}else{
				dat=t.data('max').date,
				dY=dat.getFullYear(),
				dM=dat.getMonth()+1;
				if(current){
					if(current.y>dY && current.m>dM){
						max=60;console.log(max);
						selected=null;
						o.val('');
					}else if(current.y==dY && current.m==dM){
						max=dat.getDate();
						if(current.d>max){
							selected=null;
							o.val('');
						}
					}
				}
			}

			html+='<option value="">日</option>';
			if(conf.week && conf.weekName){
				var wk=conf.weekName;
				for(var i=1,l=len;i<=l;i++){
					var w=wk[(new Date(tY,tM-1,i)).getDay()];
					var s=(selected==i ? ' selected="selected"' : '');
					var d=(i<min || i>max ? ' disabled="disabled"' : '');
					html+='<option value="'+i+'"'+s+''+d+'>'+((' '+i).slice(-2))+'日('+w+')</option>';
				}
			}else{
				for(var i=1,l=len;i<=l;i++){
					var s=(selected==i ? ' selected="selected"' : '');
					var d=(i<min || i>max ? ' disabled="disabled"' : '');
					html+='<option value="'+i+'"'+s+''+d+'>'+((' '+i).slice(-2))+'日</option>';
				}
			}
			o.html(html);
		},

		setH=function(t,selected){
			var html='',o=t.data('h');
			if(!selected){
				selected=o.val();
			}

			html+='<option value="">時</option>';
			for(var i=0,l=23;i<=l;i++){
				var s=(selected==i ? ' selected="selected"' : '');
				html+='<option value="'+i+'"'+s+'>'+((' '+i).slice(-2))+'時</option>';
			}

			o.html(html);
		},

		setI=function(t,selected){
			var html='',step=conf.minuteStep,o=t.data('i');
			if(!selected){
				selected=o.val();
			}

			html+='<option value="">分</option>';
			for(var i=0,l=59;i<=l;i=i+step){
				var s=(selected==i ? ' selected="selected"' : '');
				html+='<option value="'+i+'"'+s+'>'+(('0'+i).slice(-2))+'分</option>';
			}

			o.html(html);
		};

		var changeY=function(e){
			var t=$(e.target).data('target');
			setY(t);
			setM(t);
			setD(t);
			setValue(t);
		},

		changeM=function(e){
			var t=$(e.target).data('target');
			setM(t);
			setD(t);
			setValue(t);
		},

		changeD=function(e){
			var t=$(e.target).data('target');
			setValue(t);
		},

		changeH=function(e){
			var t=$(e.target).data('target');
			setValue(t);
		},

		changeI=function(e){
			var t=$(e.target).data('target');
			setValue(t);
		};


		$(this).each(function(){
			var t=$(this),
			wrap=$('<span/>'),
			id=(''+Math.random()).substr(2),
			isTime=t.data('time'),
			d={
				id:id,
				default:dec(t.val()),
				min:dec(t.data('min')),
				max:dec(t.data('max'),true),
				y:oY.clone(true),
				m:oM.clone(true),
				d:oD.clone(true),
				formatDate:t.data('formatDate') || conf.formatDate,
				formatTime:null
			};

			if(t.data('formatTime')){
				d.formatTime=t.data('formatTime');
			}else if(isTime){
				d.formatTime=conf.formatTime;
			}

			if(isTime){
				d.h=oH.clone(true);
				d.i=oI.clone(true);
				wrap.append(d.y).append(d.m).append(d.d).append(d.h).append(d.i);
			}else{
				wrap.append(d.y).append(d.m).append(d.d);
			}

			d.y.on('change',changeY).data({target:t});
			d.m.on('change',changeM).data({target:t});
			d.d.on('change',changeD).data({target:t});
			if(isTime){
				d.h.on('change',changeH).data({target:t});
				d.i.on('change',changeI).data({target:t});
			}

			if(d.default){
				var def=d.default.date;
				d.y.val(def.getFullYear());
				d.m.val(def.getMonth()+1);
				d.d.val(def.getDate());
				if(isTime){
					d.h.val(def.getHours());
					d.i.val(def.getMinutes());
				}
			}

			t.data(d);
			setY(t);
			setM(t);
			setD(t);
			if(isTime){
				setH(t);
				setI(t);
			}

			t.after(wrap);
		});
	};
})(jQuery);