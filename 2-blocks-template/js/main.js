jQuery(document).ready(function($){
	//store DOM elements
	var imageWrapper = $('.cd-images-list'),
		imagesList = imageWrapper.children('li'),
		contentWrapper = $('.cd-content-block'),
		contentList = contentWrapper.children('ul').eq(0).children('li'),
		blockNavigation = $('.block-navigation'),
		blockNavigationNext = blockNavigation.find('.cd-next'),
		blockNavigationPrev = blockNavigation.find('.cd-prev'),
		//used to check if the animation is running
		animating = false;

	//on mobile - open a single project content when selecting a project image
	imageWrapper.on('click', 'a', function(event){
		event.preventDefault();
		var device = MQ();
		
		(device == 'mobile') && updateBlock(imagesList.index($(this).parent('li')), 'mobile');
	});

	//on mobile - close visible project when clicking the .cd-close btn
	contentWrapper.on('click', '.cd-close', function(){
		var closeBtn = $(this);
		if( !animating ) {
			animating = true;
			
			closeBtn.removeClass('is-scaled-up').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				contentWrapper.removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					animating = false;
				});

				$('.cd-image-block').removeClass('content-block-is-visible');
				closeBtn.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			});
		}
	});

	//on desktop - update visible project when clicking the .block-navigation
	blockNavigation.on('click', 'button', function(){
		var direction = $(this),
			indexVisibleblock = imagesList.index(imageWrapper.children('li.is-selected'));

		if( !direction.hasClass('inactive') ) {
			var index = ( direction.hasClass('cd-next') ) ? (indexVisibleblock + 1) : (indexVisibleblock - 1); 
			updateBlock(index);
		}
	});


	//New added 
	$("#add-user-btn").click(function(){
			$("#playername").removeClass("alert_border");
			$("#playerage").removeClass("alert_border");
			name = $("#playername").val();
			age = $("#playerage").val();

			if (name==""){
				$("#playername").addClass("alert_border");
			}
			if (age==""){
				$("#playerage").addClass("alert_border");
			}
			if(age && name){
				$("#playername").val('');
				$("#playerage").val('');

				var new_player = {
			        "name": name,
			        "age": age[0],
			    }
			    new_player = JSON.stringify(new_player)
			    var xhr = new XMLHttpRequest()
			    xhr.open("POST","http://student04.cse.nd.edu:51024/players/",true)  

			    xhr.onload = function(e){
			        var temp = JSON.parse(xhr.responseText)
			        player_id =  temp["id"]
			        updatePlayer(player_id,name, age)
			        alert("user added")
			    }
			    xhr.onerror = function(e){
			        console.error(xhr.statusText);
			    }
			    xhr.send(new_player)
			}
	})

	$("#choose-user-btn").click(function(){
			$("#player_id").removeClass("alert_border");
			player_id = $("#player_id").val();
			
			if (player_id==""){
				$("#player_id").addClass("alert_border");
			}
			else{
				$("#player_id").val('');
			    
			    var xhr = new XMLHttpRequest()
			    xhr.open("GET","http://student04.cse.nd.edu:51024/players/"+player_id,true)  

			    xhr.onload = function(e){
			        var temp = JSON.parse(xhr.responseText)
			        name =  temp["name"]
			        age =  temp["age"]
			        updatePlayer(player_id,name, age)
			        alert("user changed")
			    }
			    xhr.onerror = function(e){
			        console.error(xhr.statusText);
			    }
			    xhr.send()			
			}
	})


	$("#choose-opp-btn").click(function(){
		if($("body").attr("playerid")==""){
			$("#player_id").addClass("alert_border");
			alert("Please choose a player first.")
		}
		else{
			$("#opp_id").removeClass("alert_border");
			opp_id = $("#opp_id").val();
			
			if (opp_id==""){
				$("#opp_id").addClass("opp_id");
			}
			else{
				$("#opp_id").val('');
				player_id = $("body").attr("playerid");
				winner = $('input[name="winner"]:checked').val();
				var new_game = {
			        "player1": player_id,
			        "player2": opp_id,
			        "result" : winner
			    }
			    new_game = JSON.stringify(new_game)
			    var xhr = new XMLHttpRequest()
			    xhr.open("POST","http://student04.cse.nd.edu:51024/games/",true)  

			    xhr.onload = function(e){
			        var temp = JSON.parse(xhr.responseText)
			        gameID =  temp["gameID"]
			        
			        alert("Game added, the id is "+ gameID)
			    }
			    xhr.onerror = function(e){
			        console.error(xhr.statusText);
			    }
			    xhr.send(new_game)
			}
		}
	})


	$("#delete-game-btn").click(function(){
			$("#game_id").removeClass("alert_border");
			game_id = $("#game_id").val();
			
			if (game_id==""){
				$("#game_id").addClass("alert_border");
			}
			else{
				$("#game_id").val('');
			    
			    var xhr = new XMLHttpRequest()
			    xhr.open("DELETE","http://student04.cse.nd.edu:51024/games/"+game_id,true)  

			    xhr.onload = function(e){
			        alert("Game deleted.")
			    }
			    xhr.onerror = function(e){
			        console.error(xhr.statusText);
			    }
			    xhr.send()			
			}
	})


	$("#get-ranking").click(function(){
	
	    var xhr = new XMLHttpRequest()
	    xhr.open("GET","http://student04.cse.nd.edu:51024/rank/",true)  

	    xhr.onload = function(e){
	    	var temp = JSON.parse(xhr.responseText)
	        console.log(xhr.responseText)
	    }
	    xhr.onerror = function(e){
	        console.error(xhr.statusText);
	    }
	    xhr.send()
	})


	function updatePlayer(player_id, player_name, player_age){
		$("body").attr("playerid",playerid)
		$("body").attr("playername",playername)
		$("#user-info").append("<span> Current player id is:"+ playerid+"</span>")
		$("#user-info").append("<span> Current player name is:"+ player_name+"</span>")
		$("#user-info").append("<span> Current player age is:"+ player_age+"</span>")
	}


	//on desktop - update visible project on keydown
	$(document).on('keydown', function(event){
		var device = MQ();
		if( event.which=='39' && !blockNavigationNext.hasClass('inactive') && device == 'desktop') {
			//go to next project
			updateBlock(imagesList.index(imageWrapper.children('li.is-selected')) + 1);
		} else if( event.which=='37' && !blockNavigationPrev.hasClass('inactive') && device == 'desktop' ) {
			//go to previous project
			updateBlock(imagesList.index(imageWrapper.children('li.is-selected')) - 1);
		}
	});

	function updateBlock(n, device) {
		if( !animating) {
			animating = true;
			var imageItem = imagesList.eq(n),
				contentItem = contentList.eq(n);
			
			classUpdate($([imageItem, contentItem]));
			
			if( device == 'mobile') {
				contentItem.scrollTop(0);
				$('.cd-image-block').addClass('content-block-is-visible');
				contentWrapper.addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					contentWrapper.find('.cd-close').addClass('is-scaled-up');
					animating = false;
				});
			} else {
				contentList.addClass('overflow-hidden');
				contentItem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					contentItem.siblings().scrollTop(0);
					contentList.removeClass('overflow-hidden');
					animating = false;
				});
			}

			//if browser doesn't support transition
			if( $('.no-csstransitions').length > 0 ) animating = false;

			updateBlockNavigation(n);
		}
	}

	function classUpdate(items) {
		items.each(function(){
			var item = $(this);
			item.addClass('is-selected').removeClass('move-left').siblings().removeClass('is-selected').end().prevAll().addClass('move-left').end().nextAll().removeClass('move-left');
		});
	}

	function updateBlockNavigation(n) {
		( n == 0 ) ? blockNavigationPrev.addClass('inactive') : blockNavigationPrev.removeClass('inactive');
		( n + 1 >= imagesList.length ) ? blockNavigationNext.addClass('inactive') : blockNavigationNext.removeClass('inactive');
	}

	function MQ() {
		return window.getComputedStyle(imageWrapper.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
	}

});