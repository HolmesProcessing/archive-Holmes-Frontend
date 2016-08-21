'use strict';

// handle search form submit
$('#objects-search-form').on('submit', function( event ) {
	var formJSON = {
		module: "objects",
		action: "search",
		parameters: {}
	};
	$.each($('#objects-search-form input[type="text"]'), function(k, v){
		formJSON.parameters[$(v).attr('name')] = $(v).val();
	});
	$.each($('#objects-search-form input[type="checkbox"]'), function(k, v){
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

			var c = r.result.Objects.length;
			$('#objects-search-results tbody').empty();
			$('#objects-search-analyze').addClass('hidden');

			var obj_list = [];

			if(!c){
				$.growl.warning({ title: "Found "+c, message: "Sorry, nothing found! :(", size: 'large' });
			} else {
				$.each(r.result.Objects, function(k, v){
					$('#objects-search-results tbody').append(
						'<tr>'+
						'<td><a href="#module=objects&action=get&sha256='+v.sha256+'">'+v.sha256+'</a></td>'+
						'<td>'+v.sha1+'</td>'+
						'<td>'+v.md5+'</td>'+
						'<td>'+v.mime+'</td>'+
						'<td>'+v.obj_name+'</td>'+
						'<td>'+v.source+'</td>'+
						'<td>'+v.submissions+'</td>'+
						'</tr>'
					);

					obj_list.push([v.sha256, v.obj_name, v.source]);
				});

				analyze_modal_build(obj_list);
				$('#objects-search-analyze').removeClass('hidden');
			}
		},
	});

	event.preventDefault();
});

// load and append analyze modal
$.ajax({
	url: "modules/objects/analyze-modal.html",
	success: function (data) { $('#content').append(data); },
	dataType: 'html'
});
