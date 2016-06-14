'use strict';

function get_result(id){
	$.ajax({
		type: 'POST',
		url: current_env.get('api_url'),
		processData: false,
		contentType: 'application/json',
		data: JSON.stringify({
			module: "results",
			action: "get",
			parameters: {"id":id}
		}),
		success: function(r) {
			if(r.error != ""){
				$.growl.warning({ title: "An error occured!", message: r.error, size: 'large' });
			} else {
				$.each(r.result.Result, function(k, v){
					$('#results-get-form input[name="'+k+'"]').val(v);
				});

				$('#results-get-form textarea[name="results"]').val(r.result.Result.results);

				$('#results-get-form p[name="sha256"]').append('<a href="#module=objects&action=get&sha256='+r.result.Result.sha256+'">'+r.result.Result.sha256+'</a>');
			}
		},
	});
}

get_result(current_env.get('url_hash').get('id'));
