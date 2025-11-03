<?php

// mon

	# css
		#page::$css_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/lib/jquery-ui/jquery-ui.min.css';


	# js
		#page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/lib/jquery-ui/jquery-ui.min.js';
		#page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/catalogo/js/catalogo'.JS_SUFFIX.'.js';


	$title 			= $this->get_element_from_template_map('title', $template_map->{$mode});
	$abstract  		= $this->get_element_from_template_map('abstract', $template_map->{$mode});
	$body  			= $this->get_element_from_template_map('body', $template_map->{$mode});


	// page vars
		$area_name 	= $this->area_name;  // like 'espacios'
		$area_table = $this->area_table; // like 'contextos'
		$section_id = $this->row->section_id; // like 1


	// API search call
		// $options = new stdClass();
		// 	$options->dedalo_get 	= 'records';
		// 	$options->table 		= 'faqs';
		// 	$options->ar_fields 	= '*';
		// 	$options->lang 			= WEB_CURRENT_LANG_CODE;
		// 	$options->order 		= 'section_id ASC';
		// 	$options->limit 		= 0;
		// $response = json_web_data::get_data($options);

		$options = new stdClass();
			$options->dedalo_get 	= 'records';
			$options->table 		= 'ts_web_bastida';
			$options->ar_fields 	= '*';
			$options->lang 			= WEB_CURRENT_LANG_CODE;
			$options->order 		= 'section_id ASC';
			$options->limit 		= 1;
			$options->sql_filter	= 'section_id=' . (int)$section_id;
			/*$options->resolve_portals_custom = (object)[
				'faqs' => 'faqs'
			];*/
		$response = json_web_data::get_data($options);


	// rows
		$result		= reset($response->result);


		$options = new stdClass();
			$options->dedalo_get 	= 'records';
			$options->table 		= 'ts_web_bastida';
			$options->ar_fields 	= 'section_id,title,abstract,norder';
			$options->lang 			= WEB_CURRENT_LANG_CODE;
			$options->order 		= 'norder ASC';
			$options->limit 		= 30;
			$options->sql_filter	= 'parent="'.$result->term_id.'"';
		$response = json_web_data::get_data($options);

		$data_list	= isset($response->result)
			? $response->result
			: [];

var_dump($response);


	// debug
		// dump($response, ' response ++ '.to_string());
		// dump($data_list, ' data_list ++ '.to_string());
