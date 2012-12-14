var height = 25;
var width = 110;
var initComplete = false;


var initForPlayersPage = function() {
		console.log("players page pagebeforecreate");
		getFirstData();
		
		$('.player .ui-btn').live('vclick', function() {
			var params = this.id.split('-');
			
			var player = params[0];
			var result = params[1];
			
			$.mobile.loading('show', {
				text: 'saving',
				textVisible: true,
			});
			
			$('#li_'+player).addClass("in-progress");
			
			$.ajax({
			   url:'/rest/attempt/' + player + "/" + result,
			   success: function(resultObject) {
				   refreshData();
			   } 
			});
		});
}

var initForChartsPage = function() {
	console.log("charts page pagebeforecreate");
	if(!initComplete) {
	} else {
		$('#chartsPage').trigger( "create" );
	}
}

var getFirstData = function() {
	console.log("getting first data");
	$.ajax({
	   url:'/rest/scores',
	   success: function(players) {
		   
		   for(var id in players) {
				var p = players[id];
				addPlayer(p);
		   };
		   
		   console.log("triggering refresh");
		   $('#players-list').listview('refresh');
		   $('#playersPage').trigger( "create" );
	   } 
	});
};

var refreshData = function() {
	console.log("refreshing data");
	$.ajax({
		url:'/rest/scores',
		success: function(players) {
			for(var id in players) {
				var p = players[id];
				refreshPlayer(p);
				$('#li_'+ p.playerLogin).removeClass("in-progress");
				$.mobile.loading('hide');
			};
		} 
	});
};

var getData = function(accuracies, accuracy) {
	var data = [];
	
	for(var id in accuracies) {
		var a = accuracies[id];
		
		data.push([
			parseInt(id),
			a - accuracy
		]);
	}
	
	return data;
}

var updateGraph = function(login, accuracies, accuracy) {
	console.log("updating graph for " + login);
	var data = getData(accuracies, accuracy);
	
	var horizon = d3.horizon()
	    .width(width)
	    .height(height)
	    .mode("mirror")
	    .bands(3)
	    .tension(0.7)
	    .interpolate("bundle");
		
	var allData = [data];

	var chart = d3
		.select("#graph_" + login + " svg");
	
	chart.data(allData)
	    .call(horizon);
}

var addPlayer = function(p) {
	console.log("adding player " + p.playerLogin);
	var id = p.playerLogin;
	var $li = $('<li/>');
	$li.attr("id", "li_" + id);
	$li.attr("class", "player");
	
	var $fieldset = $('<fieldset class="ui-grid-a"/>');
	
	var $blockA = $('<div class="ui-block-a"/>');
	var $h2 = $('<h2 data-role="fieldcontain"/>');
	$h2.html(p.playerName);
	
	var $scores = $('<div class="total scores"/>');
	var $accuracy = $('<span id="accuracy_' + id + '" class="accuracy"/>');
	var $attempts = $('<span id="attempts_' + id + '" class="attempts"/>');
	
	$scores.append($attempts).append($accuracy);
	
	var $recentScores = $('<div class="recent scores"/>');
	var $recentAccuracy = $('<div id="recentAccuracy_' + id + '" class="accuracy"/>');
	var $graph = $('<div id="graph_' + id + '" class="graph"/>');
	
	$recentScores.append($graph).append($recentAccuracy);
	
	$blockA.append($h2).append($scores).append($recentScores);
	
	var $blockB = $('<div class="ui-block-b buttons"/>');
	var $hitButton = $('<a href="#" data-role="button" data-icon="plus"	data-iconpos="notext" data-inline="true">hit</a>');
	$hitButton.attr("id", id + "-hit");
	var $missButton = $('<a href="#" data-role="button" data-icon="minus" data-iconpos="notext" data-inline="true">miss</a>');
	$missButton.attr("id", id + "-miss");
	
	$blockB.append($hitButton).append($missButton);
	
	$fieldset.append($blockA).append($blockB);
	
	$li.append($fieldset);
	
	$('#players-list').append($li);

	var svg = d3.select("#graph_" + id).append("svg")
		.attr("width", width)
		.attr("height", height);

	refreshPlayer(p);
};

var refreshPlayer = function(p) {
	console.log("refreshing player " + p.playerLogin);
	var id = p.playerLogin;
	$('#attempts_' + id).html(p.nbOfAttempts + ' shoots @');
	
	$('#accuracy_' + id).html(asPercent(p.accuracy));
	$('#recentAccuracy_' + id).html(asPercent(p.recentAccuracy));
	
	updateGraph(p.playerLogin, p.accuracies, p.accuracy);
};

var asPercent = function(acc) {
	return (acc * 100).toFixed(1)+ '%';
} 