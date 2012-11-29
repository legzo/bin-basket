$(document).bind('pagebeforecreate', function() {

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
});

var getFirstData = function() {
	
	$.ajax({
	   url:'/rest/scores',
	   success: function(players) {
		   
		   for(var id in players) {
				var p = players[id];
				addPlayer(p);
				
				initGraph(p.playerLogin, p.accuracies);
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
				$('#li_'+ p.playerLogin).removeClass("in-progress");
				$.mobile.loading('hide');
			};
		} 
	});
};

var initGraph = function(login, accuracies) {
	var data = [];
	
	for(var id in accuracies) {
		var a = accuracies[id];
		
		data.push({
			id: parseInt(id),
			value: a
		});
	}
	
	var margin = {top: 2, right: 2, bottom: 2, left: 2},
	width = 110 - margin.left - margin.right,
	height = 30 - margin.top - margin.bottom;
	
	var yMax = 0.35;
	
	var x = d3.scale.linear()
		.range([0, width]);
	
	var y = d3.scale.linear()
		.range([height, 0]);
	
	x.domain(d3.extent(data, function(d) { return d.id; }));
	y.domain([0, yMax]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	
	var area = d3.svg.area()
		.x(function(d) { return x(d.id); })
		.y0(height)
		.y1(function(d) { return y(d.value); });
	
	var line = d3.svg.line()
		.x(function(d) { return x(d.id); })
		.y(function(d) { return y(d.value); });

	var xAxis = d3.svg.line()
	    .x(function(d) { return x(d.id); })
		.y(function(d) { return y(yMax - 0.1); });
	
	var svg = d3.select("#graph_" + login).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	svg.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("d", area);
	
	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);
	
	 svg.append("path")
	 	.datum(data)
	    .attr("class", "xAxis")
	    .attr("d", xAxis);
}


var addPlayer = function(p) {
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
	
	$recentScores.append($recentAccuracy).append($graph);
	
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

	refreshPlayer(p);
};

var refreshPlayer = function(p) {
	var id = p.playerLogin;
	$('#attempts_' + id).html(p.nbOfAttempts+' shoots @');
	
	var accuracy = p.accuracy.toFixed(3) +'';
	var recentAccuracy = p.recentAccuracy.toFixed(3) +'';
	$('#accuracy_' + id).html(accuracy.substring(1,5) );
	$('#recentAccuracy_' + id).html(recentAccuracy.substring(1,5));
};