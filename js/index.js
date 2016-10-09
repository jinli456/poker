$(function(){
	function makePoker(){
		var poker=[];//定义一副扑克
	var colors=['h','s','c','d'];//四种花色
	var biao={};//内容形式：{6s：true}
	while(poker.length!=52){//如果扑克张数少于52
		var index=Math.floor(Math.random()*4);//下标0-3向下取整
		var c=colors[index];
		var n=Math.ceil(Math.random()*13);//牌面上的数字向上取整
		var v={color:c,number:n};//花色为c数值为n的牌
		if(!biao[c+n]){
			poker.push(v);
			biao[c+n]=true;
		}//如果biao里c这个花色和n这个面值为false，就把这张牌放进poker里
		
	}
	return poker;
	}

	function setPoker(poker){
		var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'};
		//定义一个词典转换数字
		var index=0;
		for(var i=0,poke;i<7;i++){
			for(var j=0;j<i+1;j++){
				poke=poker[index];
				index+=1;//把牌按金字塔摆放
				$('<div>')
				.attr('id',i+'_'+j)//定义自定义属性
				.addClass('pai')
				.attr('data-number',poke.number)
				.css('background-image','url(./image/'+dict[poke.number]+poke.color+'.png)')
				.appendTo('.scene')
				.delay(index*30)
				.animate({top:i*40,left:130*j+(6-i)*65,opacity:1})
			}
			
		}
		//剩余的牌
		for(;index<poker.length;index++){
			var v=poker[index];
			$('<div>').attr('data-number',v.number)
			.addClass('pai left')//给牌加了个类
			.css('background-image','url(./image/'+dict[v.number]+v.color+'.png)')
			.appendTo('.scene')
			.delay(index*30)
			.animate({top:432,left:130,opacity:1})
		}
	}	
	/*	setPoker(makePoker());*/

		var right=$(".move-right");
		var left=$('.move-left');
		$('.move-left').css('opacity','0');
			$('.move-right').css('opacity','0');
		//右移 闭包
		right.on('click',(function(){
			var zIndex=1;
			return function(){
				if($(".left").length){//如果左边还有牌
				$('.left').last()
				.css('z-index',zIndex++)//调层级
				.animate({left:650})
				.queue(function(){$(this)
				.removeClass('left')
				.addClass('right')
				.dequeue();})
			}
		
		}
		}())
		)

		
			
		//向左移
		left.on('click',(function(){
			var num=0;
			return function(){
				if($('.left').length){
				return;
			}
			//如果左边还有牌，右边牌则不动
			num++;
			if(num>3){
				return;
			}
			//如果左移大于3次就不能再移动
			$('.right')
			.each(function(i){$(this).delay(i*100)
			.css('z-index',0)
			.animate({left:130})
			.queue(function(){$(this)
			.removeClass('right')
			.addClass('left').dequeue();})

			
		})
		}
	
	}())
	)
		//功能 给你一个dom对象，它给你返回数字
		function getNumber(el){
			return parseInt($(el).attr('data-number'));
		}
		//判断能不能点击即有没有被压着
		function isCanClick(el){
			var x=parseInt($(el).attr('id').split('_')[0]);
			var y=parseInt($(el).attr('id').split('_')[1]);
			if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){//有一张或两张压着，判断下一行的下标
				return false;
			}else{
				return true;
			}
		}

		var prev=null;//类似于开关思想
		$('.scene').on('click','.pai',function(){
			//事件委派
			var number=getNumber($(this));
			$(this).css('border','1px solid red')
			// $(this).animate({top:'-=20'})
			//点击时加边框
			if($(this).attr('id')&&!(isCanClick(this))){//如果id=0并且不能点击
				$(this).css('border','none')
				return;
			}
			if(number==13){
				//如果数值为13就直接改变位置。消失
				$(this).animate({top:0,left:700}).queue(function(){
					$(this).detach().dequeue();
				})
			}
			if(prev){//第一张 把这张存储
				//第二张 上次存储的和现在点的这个拿出来判断
				if(getNumber(prev)+getNumber(this)==13){//如果两张牌加起来=13；
					prev.add(this).animate({
						top:0,left:700
					}).queue(function(){
						$(this).detach().dequeue();
					})
				}else{
					if(prev===$(this))
					$(this).animate({top:'-=20'})
					.animate({top:'+=20'})
					prev.delay(400).animate({top:'+=20'})
					prev.add(this).css('border','none');
				}
				prev=null;
			}else{
				prev=$(this);
				prev.animate({top:'-=20'})
				/*$(this).animate({top:'+=20'})*/
			}
		})

		var start=$(".start");
		var reset=$('.reset');
		var back=$('.back');
		var time=document.getElementsByClassName('time')[0];;

		var t=0;
		function sta(){
			
			$('.start').on('click',function(){
				var i=0;
				clearInterval(t);
			$('.pai').remove();
			$('.move-left').css('opacity','1');
			$('.move-right').css('opacity','1');
			setPoker(makePoker());
			t=setInterval(function(){
				i++;
				time.innerHTML=i;
				if(i==60){
				clearInterval(t);
				alert("时间到，闯关失败")
				time.innerHTML=0;
			}
			},1000)
			
		})

		}
		sta();
		$('.reset').on('click',function(){
			$('.pai').remove();
			clearInterval(t);
			 var i=0;
			$('.move-left').css('opacity','1');
			$('.move-right').css('opacity','1');
			setPoker(makePoker());
			t=setInterval(function(){
				i++;
				time.innerHTML=i;
				if(i==60){
				clearInterval(t);
				alert("时间到，闯关失败")
				time.innerHTML=0;
			}
			},1000)

		})
})