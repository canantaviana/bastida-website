<?php
/**
* TRIGGER
*/
# CONFIG
	$start_time=microtime(1);
	include( dirname(dirname(__FILE__)) . '/config/config.php' );
	include( dirname(__FILE__) .'/class.yacimientos.php' );

# TRIGGER_MANAGER. Add trigger_manager to receive and parse requested data
	common::trigger_manager();



/**
* LOAD_MORE_ITEMS
* @return object $response
*/
function load_more_items($json_data) {
	global $start_time;

	$response = new stdClass();
		$response->result 	= false;
		$response->msg 		= 'Error. Request failed ['.__FUNCTION__.']';

	# set vars
	$vars = array('table','ar_section_id','offset','limit');
		foreach($vars as $name) {
			$$name = common::setVarData($name, $json_data);
			# DATA VERIFY
			if ($name==='offset' || $name==='limit') continue; # Skip non mandatory
			if (empty($$name)) {
				$response->msg = 'Trigger Error: ('.__FUNCTION__.') Empty '.$name.' (is mandatory)';
				return $response;
			}
		}	

	// options
		$ar_calls[] = (object)[
			'id' 	  => $table,
			'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
		];

	// api combi call
		$options = new stdClass();
			$options->dedalo_get 	= 'combi';
			$options->ar_calls 		= $ar_calls;
		# Http request in php to the API
		$response = json_web_data::get_data($options);


	$data_list = []; // note is an asoc array
	foreach ($response->result as $key => $element) {			
		$data_list[$element->id] = array_map(function($row) use($element){
			return yacimientos::parse_row($row, $element->id);
		}, $element->result);
	}
	#dump($data_list, ' data_list ++ '.to_string());
	
	
	$response->result 	= $data_list[$table];
	$response->msg 		= 'Ok. Request done ['.__FUNCTION__.']';


	# Debug
	if(SHOW_DEBUG===true) {
		$debug = new stdClass();
			$debug->exec_time	= exec_time_unit($start_time,'ms')." ms";
			foreach($vars as $name) {
				$debug->{$name} = $$name;
			}

		$response->debug = $debug;
	}

	return (object)$response;
}//end load_more_items


