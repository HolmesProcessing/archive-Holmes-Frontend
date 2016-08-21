'use strict';

function render_result(r){
	$('#results-presentation').append('<div class="row"><div class="col-md-6"><canvas id="detectedPie" width="400" height="400"></canvas></div><div class="col-md-6"><canvas id="topResults" width="400" height="400"></canvas></div></div>');
	buildPie(JSON.parse(r.results));
	buildTop10(JSON.parse(r.results));
}

function buildTop10(j){
	var dict = {}

	$.each(j.scans, function(id,scan) {
		if(scan.detected) {
			if(!(scan.result in dict)){
				dict[scan.result] = 0;
			}

			dict[scan.result] += 1
		}
	});

	var items = Object.keys(dict).map(function(key) {
		return [key, dict[key]];
	});

	items.sort(function(first, second) {
		return second[1] - first[1];
	});
	items = items.slice(0, 10);

	var labels = []
	var data = []
	for (var index = 0; index < items.length; ++index) {
		labels[index] = items[index][0];
		data[index] = items[index][1];
	}

	var data = {
		labels: labels,
		datasets: [
		{
			label: "Top 10 results",
			data: data
		}]
	};

	var ctx = $("#topResults");

	var myPieChart = new Chart(ctx,{
		type: 'bar',
		data: data,
		options: {
			scales: {
				xAxes: [{
					display: false,
					stacked: false
				}],
				yAxes: [{
					stacked: true
				}],
			}
		}
	});
}

function buildPie(j){
	var counter = 0;
	var detected = 0;

	$.each(j.scans, function(id,scan) {
		counter += 1;
		if(scan.detected) {
			detected += 1;
		}
	});

	var data = {
		labels: [
		"Detected",
		"Undetected"
		],
		datasets: [
		{
			data: [detected, counter-detected],
			backgroundColor: [
			"#0d8098",
			"#980d80"
			],
			hoverBackgroundColor: [
			"#09596a",
			"#6a0959",
			]
		}]
	};

	var ctx = $("#detectedPie");

	var myPieChart = new Chart(ctx,{
		type: 'pie',
		data: data
	});
}
