var height = 25;
var width = 110;
var initComplete = false;
var margin = {top: 20, right: 50, bottom: 20, left: 50};

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
				   refreshPlayersData();
			   } 
			});
		});
		
		initForChartsPage(false);
		
		
		$('#linkCharts').live('vclick', function() {
			$('#players-list').hide();
			$('#chart').show();
			updateLineChart();
		});
		
		$('#linkPlayers').live('vclick', function() {
			$('#chart').hide();
			$('#players-list').show();
			refreshPlayersData();
		});
}

var initForChartsPage = function(needData) {
	console.log("charts page pagebeforecreate");
		
	var width = $(window).width() - margin.left - margin.right,
    height = width * 0.75 - margin.top - margin.bottom;

	var svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	if(needData){
		updateLineChart();
	}
}

var updateLineChart = function() {
	
	d3.json("/rest/scores", function(data, error) {
		
		var width = $(window).width() - margin.left - margin.right,
	    height = width * 0.75 - margin.top - margin.bottom;
		
		var svg = d3.select("#chart svg g");
		
		var players = getDataForLineChart(data);
		var x = d3.scale.linear()
    		.range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);
	
		var color = d3.scale.category20c();
	
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
	
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
	
		var line = d3.svg.line()
		    .interpolate("basis")
		    .x(function(d) { return x(d.index);	})
		    .y(function(d) { return y(d.value); });
		
		color.domain(d3.keys(players));
	
		x.domain([0, 100]);
	
		y.domain([0, 0.6]);
		
		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);
	
		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis);
		
		var player = svg.selectAll(".playerLine")
		  .data(players)
		  .enter()
		  .append("g")
		  .attr("class", "playerLine");
		
		player.append("path")
		    .attr("class", "line")
		    .attr("d",  function(d) { return line(d.values); })
		    .style("stroke", function(d) { return color(d.name); });
		
		player.append("text")
		    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
		    .attr("transform", function(d) { return "translate(" + x(d.value.index) + "," + y(d.value.value) + ")"; })
		    .attr("x", 3)
		    .attr("dy", ".35em")
		    .text(function(d) { return d.name; });
		
		var playerUpdate = svg.selectAll(".playerLine path")
			.data(players)
			.attr("d",  function(d) { return line(d.values); })
		
	});
}

var getDataForLineChart = function(data) {
	return d3.keys(data).map(function(i) {
		var idx = 1;
		var values = [];
		
		for(var id in data[i].accuracies) {
			var a = data[i].accuracies[id];
			
			values.push({index: idx, value: a});
			idx++;
		}
		
		return {
			name 	: data[i].playerLogin.toLowerCase(),
			values 	: values
		};
	});
}

var getFirstData = function() {
	console.log("getting first data");
	
	d3.json("/rest/scores", function(players, error) {
		 for(var id in players) {
				var p = players[id];
				addPlayer(p);
		   };
		   
		   console.log("triggering refresh");
		   $('#players-list').listview('refresh');
		   $('#playersPage').trigger( "create" );
	});
	
};

var refreshPlayersData = function() {
	console.log("refreshing players data");
	d3.json("/rest/scores", function(players, error) {
		for(var id in players) {
			var p = players[id];
			refreshPlayer(p);
			$('#li_'+ p.playerLogin).removeClass("in-progress");
			$.mobile.loading('hide');
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