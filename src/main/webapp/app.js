$(document).bind('pagebeforecreate', function() {

	getFirstData();
	
	$('.player .ui-btn').live('vclick', function() {
		var params = this.id.split('-');
		
		var player = params[0];
		var result = params[1];
		
		$.ajax({
		   url:'/rest/attempt/' + player + "/" + result,
		   success: function(resultObject) {
			   $('#my_toast').html('saved ' + result + ' for ' + player);
			   $('#my_toast').toast('show');
			   
			   refreshData();
		   } 
		});
	});
});

var getFirstData = function() {
	
	$.ajax({
	   url:'/rest/scores',
	   success: function(players) {
		   
		   for(var id in players) {
				var p = players[id];
				addPlayer(p);
			};
			
			$('#players-list').listview('refresh');
			$('#my_page').trigger( "create" );
	   } 
	});
};

var refreshData = function() {
	
	$.ajax({
		url:'/rest/scores',
		success: function(players) {
			for(var id in players) {
				var p = players[id];
				refreshPlayer(p);
			};
		} 
	});
};

var addPlayer = function(p) {
	var id = p.playerLogin;
	var $li = $('<li/>');
	$li.attr("id", id);
	$li.attr("class", "player");
	
	var $fieldset = $('<fieldset class="ui-grid-a"/>');
	
	var $blockA = $('<div class="ui-block-a"/>');
	var $h2 = $('<h2 data-role="fieldcontain"/>');
	$h2.html(p.playerName);
	
	var $scores = $('<div class="scores"/>');
	var $accuracy = $('<span id="accuracy_' + id + '" class="accuracy"/>');
	$accuracy.html(p.accuracy.toFixed(3) +'%');
	var $attempts = $('<span id="attempts_' + id + '" class="attempts"/>');
	$attempts.html(' ('+p.nbOfAttempts+' shoots)');
	
	$scores.append($accuracy).append($attempts);
	
	$blockA.append($h2).append($scores);
	
	var $blockB = $('<div class="ui-block-b buttons"/>');
	var $hitButton = $('<a href="#" data-role="button" data-icon="plus"	data-iconpos="notext" data-inline="true">hit</a>');
	$hitButton.attr("id", id + "-hit");
	var $missButton = $('<a href="#" data-role="button" data-icon="minus" data-iconpos="notext" data-inline="true">miss</a>');
	$missButton.attr("id", id + "-miss");
	
	$blockB.append($hitButton).append($missButton);
	
	$fieldset.append($blockA).append($blockB);
	
	$li.append($fieldset);
	
	$('#players-list').append($li);
};

var refreshPlayer = function(p) {
	var id = p.playerLogin;
	$('#attempts_' + id).html(' ('+p.nbOfAttempts+' shoots)');
	$('#accuracy_' + id).html(p.accuracy.toFixed(3) +'%');
};