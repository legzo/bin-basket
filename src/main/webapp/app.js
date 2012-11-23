$(document).bind('pagebeforecreate', function() {

	var players = {
		"cmo" : {
			name : "Charlotte",
			percent : "14",
			attempts : "46",
		},	
		"jfl" : {
			name : "Julien F",
			percent : "46",
			attempts : "141",
		},	
		"mma" : {
			name : "Mehdi",
			percent : "25",
			attempts : "112",
		},	
		"jte" : {
			name : "Julien T",
			percent : "21",
			attempts : "170",
		}
	};
	
	for(var id in players) {
		var p = players[id];
		console.log(id, p.percent);
		addPlayer(id, p);
	};
	
	$('.player .ui-btn').live('vclick', function() {
		console.log(this.id);
		$('#my_toast').html('fired: ' + this.id);
		$('#my_toast').toast('show');
	});
});	

var addPlayer = function(id, p) {
	var $li = $('<li/>');
	$li.attr("id", id);
	$li.attr("class", "player");
	
	var $fieldset = $('<fieldset class="ui-grid-a"/>');
	
	var $blockA = $('<div class="ui-block-a"/>');
	var $h2 = $('<h2 data-role="fieldcontain"/>');
	$h2.html(p.name);
	
	var $scores = $('<div class="scores"/>');
	var $percent = $('<span class="percent"/>');
	$percent.html(p.percent +'%');
	var $attempts = $('<span class="attempts"/>');
	$attempts.html(' ('+p.attempts+' shoots)');
	
	$scores.append($percent).append($attempts);
	
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