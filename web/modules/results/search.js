'use strict';

function apply_hash_filter(){
	var filter_counter = 0;
	for (var [k, v] of current_env.get('url_hash')) {
		if(k.indexOf("filter_") == 0 && v != ""){
			filter_counter += 1;
			$('#results-search-form input[name="'+k.slice(7)+'"]').val(v);
		}
	}

	if(filter_counter > 0){
		$('#results-search-form').submit();
	}
}

$('#results-search-form').on('submit', function( event ) {
	event.preventDefault();

	var formJSON = {
		module: "results",
		action: "search",
		parameters: {}
	};
	$.each($('#results-search-form input[type="text"]'), function(k, v){
		formJSON.parameters[$(v).attr('name')] = $(v).val();
	});
	$.each($('#results-search-form input[type="checkbox"]'), function(k, v){
		if($(v).is(':checked')){
			formJSON.parameters[$(v).attr('name')] = $(v).val();
		}
	});

	$.ajax({
		type: 'POST',
		url: current_env.get('api_url'),
		processData: false,
		contentType: 'application/json',
		data: JSON.stringify(formJSON),
		success: function(r) {
			if(r.error != ""){
				$.growl.warning({ title: "An error occured!", message: r.error, size: 'large' });
				return;
			}

			var c = r.result.Results.length;
			$('#results-search-results tbody').empty();

			if(!c){
				$.growl.warning({ title: "Found "+c, message: "Sorry, nothing found! :(", size: 'large' });
			} else {
				$.each(r.result.Results, function(k, v){
					$('#results-search-results tbody').append(
						'<tr>'+
						'<td><a href="#module=results&action=get&id='+v.id+'">'+v.id+'</a></td>'+
						'<td>'+v.sha256+'</td>'+
						'<td>'+v.service_name+'</td>'+
						'<td>'+v.tags+'</td>'+
						'<td>'+v.started_date_time+'</td>'+
						'<td>'+v.finished_date_time+'</td>'+
						'</tr>'
					);
				});
			}
		},
	});

	event.preventDefault();
});

apply_hash_filter();
