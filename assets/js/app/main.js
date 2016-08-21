'use strict';

// current_env holds all env data needed
var current_env = new Map();

// url_hash contains all vars parsed from the url
current_env.set('url_hash', new Map());


function switch_page(){
	load_current_env();
	$('#content').load('modules/'+current_env.get('url_hash').get('module')+'/'+current_env.get('url_hash').get('action')+'.html');
}


function load_current_env(){
	current_env.get('url_hash').clear();

	if(window.location.hash == ''){
		// if there are no vars we set the default here
		current_env.get('url_hash').set('module', 'dashboard');
		current_env.get('url_hash').set('action', 'view');
	}

	var hash_vars = window.location.hash.substr(1).split('&');
	for (var i = 0; i < hash_vars.length; i++){
		var kv_pair = hash_vars[i].split('=');
		current_env.get('url_hash').set(kv_pair[0], decodeURIComponent(kv_pair[1]))
	}
}


function load_config(){
	$.getJSON("assets/js/app/config.json", function(data) {
		current_env.set('debug', data['debug']);
		current_env.set('api_url', data['api_url']);
	});
}


// this runs everything on first page load
$( document ).ready(function() {
	// there is currently no reason for async calls
	$.ajaxSetup({
		async: false
	});

	load_config();

	// jquery has loaded, hide the loading overlay
	$( "#loading" ).hide();
	
	// register ajax callback functions for the loading overlay
	$( document ).ajaxStart(function() {
		$( "#loading" ).show();
	});

	$( document ).ajaxComplete(function() {
		$( "#loading" ).hide();
	});

	// load the dashboard and register the switch_page function
	switch_page();
	$(window).on('hashchange', switch_page);

	// everything done, notify the user
	$.growl.notice({ title: "Welcome!", message: "Everything is loaded and ready to be used!", location: 'bc', size: 'large' });
});
