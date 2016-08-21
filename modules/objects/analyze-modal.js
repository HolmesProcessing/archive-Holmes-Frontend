'use strict';

function analyze_modal_build(obj_list){
	$('#analyze-modal-tasks').html('');
	$.each(current_env.get('services'), function(k, v){
		$('#analyze-modal-tasks').append(
			'<div class="form-group"><div class="col-sm-offset-2 col-sm-10"><div class="checkbox">'+
			'<label><input type="checkbox" name="'+v+'" value="on" id="analyze-modal-s-'+v+'"> '+v+'</label>'+
			'</div></div></div>'
			);
	});

	$('#analyze-modal-submit').off('click');
	$('#analyze-modal-submit').on('click', function(){
		var tasks = [];
		$.each(current_env.get('services'), function(k, v){
			if($('#analyze-modal-s-'+v).is(':checked')){
				tasks.push(v);
			}
		});

		analyze_samples(
			$('#analyze-modal-username').val(),
			$('#analyze-modal-password').val(),
			obj_list,
			tasks,
			$('#analyze-modal-tags').val().split(","),
			$('#analyze-modal-comment').val()
		);
	});
}

function analyze_samples(username, password, obj_list, tasks, tags, comment){
	if(current_env.get('gateway_url') == ""){
		$.growl.warning({ title: "Warning", message: "No gateway set in your config file!" });
		return;
	}

	if(username == "" || password == ""){
		$.growl.warning({ title: "Warning", message: "Please supply username and password!" });
		return;
	}

	if(tasks.length <= 0){
		$.growl.warning({ title: "Warning", message: "Please select at least one task!" });
		return;
	}

	var tasks_prepared = {}
	$.each(tasks, function(k, v){
		tasks_prepared[v] = [];
	});

	var task_list = [];
	$.each(obj_list, function(k, v){
		task_list.push({
			"primaryURI": v[0],
			"secondaryURI": "",
			"filename": v[1],
			"tasks": tasks_prepared,
			"tags": tags,
			"comment": comment,
			"download": true,
			"source": v[2],
			"attempts": 0
		});
	});

	$.ajax({
		type: "POST",
		url:  current_env.get('gateway_url'),
		data: "task="+JSON.stringify(task_list)+"&username="+username+"&password="+password,
		success: function(result,status,xhr) {
			$.growl.notice({ title: "Done", message: "All tasks have been send to the gateway.<br/>" + result});
		},
		error: function(xhr,status,error) {
			$.growl.warning({ title: "An error occured!", message: "There was an error.<br/>Response: " + xhr.responseText + "<br/>Status Code: " + xhr.status + " ("+xhr.statusText+")"});
		}
	});
}
