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
	// image
		$ar_image 	= $this->get_element_from_template_map('image', $template_map->{$mode});
		if (!empty($ar_image)) {
			$ar_image = array_map(function($item){
				#$item = str_replace(['/1.5MB/'], ['/modificada/'], $item);
				return __WEB_BASE_URL__ . $item;
			}, (array)$ar_image);
			$ar_image = array_values(array_unique($ar_image));
		}

		// image footer (reference)
			$ar_image_footer = $this->get_element_from_template_map('reference', $template_map->{$mode});
		
	// pdf
		$pdf = $this->get_element_from_template_map('pdf', $template_map->{$mode});
		if (!empty($pdf)) {			
			$pdf = __WEB_BASE_URL__ . $pdf;	
		}
	// video
		$ar_video = $this->get_element_from_template_map('video', $template_map->{$mode});
		if (!empty($ar_video)) {			
			$ar_video = array_map(function($item){
				#$item = str_replace(['/404/','.mp4'], ['/posterframe/','.jpg'], $item);
				return __WEB_BASE_URL__ . $item;
			}, $ar_video);
		}
	// isbn
		$isbn = $this->get_element_from_template_map('isbn', $template_map->{$mode});		
	

	// page vars
		$area_name 	= $this->area_name;  // like 'espacios' 
		$area_table = $this->area_table; // like 'contextos'
		$section_id = $this->row->section_id; // like 1




		$options = new stdClass();
			$options->dedalo_get 	= 'records';
			$options->table 		= 'ts_web_bastida';
			$options->ar_fields 	= '*';
			$options->lang 			= WEB_CURRENT_LANG_CODE;
			$options->order 		= 'norder ASC';
			$options->limit 		= 30;
			$options->sql_filter	= 'parent="'.$this->row->term_id.'"';
			/*$options->resolve_portals_custom = [
				"other_images" => "image"
			];*/

		$response = json_web_data::get_data($options);

		$subpages	= isset($response->result)
			? $response->result
			: [];

		foreach ($subpages as $key => $subpage) {
			// resolve image full url
			if (!empty($subpage->other_images_resolved)) {
				$other_images = json_decode($subpage->other_images_resolved);
				$subpages[$key]->other_images_resolved = array_map(function($item){
					return __WEB_BASE_URL__ . $item;
				}, (array)$other_images);
			}
		}

	// debug dumps
		// dump($template_map->{$mode}, ' $template_map->{$mode} ++ '.to_string()); die();
		#dump($this, ' this ++ '.to_string());
		




	$gallery_data = [];
	if (!empty($this->row->other_images_resolved)) {
		$other_images = json_decode($this->row->other_images_resolved);
		$gallery_data = array_map(function($item){
			return __WEB_BASE_URL__ . $item;
		}, (array)$other_images);
	}





	$ar_calls = [];
	$table_section_id = [];

	$limit  = 5;
	$offset = 0;

	// actividades
		$table  = 'actividades';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// excavaciones
		$table  = 'excavaciones';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// catalogo
		$table  = 'catalogo';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// yacimientos
		$table  = 'yacimientos';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// contextos
		$table  = 'contextos';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// espacios
		$table  = 'espacios';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// tematicas
		$table  = 'tematicas';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname==='temas' ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit=100)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// publicaciones
		$table  = 'publicaciones';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// publicaciones_externas
		$table  = 'publicaciones_externas';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// galeria_digital
		$table  = 'galeria_digital';
		$ar_possible_columns = [
			'galeria_digital', // web_ts
			'digital_id', // contextos, actividades
		];
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table, $ar_possible_columns) {
			return in_array($item->colname, $ar_possible_columns) ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// galeria_ephemera
		$table  = 'galeria_ephemera';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// galeria_video
		$table  = 'galeria_video';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// galeria_audio
		$table  = 'galeria_audio';
		$ar_section_id = array_reduce($template_map->{$mode}, function($acc, $item) use($table) {
			return $item->colname===$table ? json_decode($item->value) : $acc;
		});
		if (!empty($ar_section_id)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// children contextos
		$temas_children_tables = ['contextos'];
		if (in_array($area_table, $temas_children_tables)) {			
			// resove inverse childrens	

			$ar_fields = ['section_id','titulo AS title','resumen AS abstract','imagen_identificativa_id'];
			$resolve_portals_custom = [
				'imagen_identificativa_id' => 'digital'
			];

			$options = new stdClass();
				$options->dedalo_get 	= 'records';
				$options->table 		= $area_table; // 'contextos';
				$options->ar_fields 	= $ar_fields;
				$options->lang 			= WEB_CURRENT_LANG_CODE;
				$options->sql_filter 	= 'parent LIKE \'%"'.$section_id.'"%\'';				
				$options->limit 		= 100;
				$options->offset 		= 0;
				$options->order 		= 'section_id ASC';
				$options->resolve_portals_custom = $resolve_portals_custom;
			
			$ar_calls[] = (object)[
				'id' 	  => 'contextos',
				'options' => $options
 			];
		}








	// yacimientos
		$table  = 'immovables';
		$ar_section_id = json_decode($this->row->immovables);
		if (!empty($this->row->immovables)) {
			$ar_calls[] = (object)[
				'id' 	  => $table,
				'options' => yacimientos::get_search_options_from_table($table, $ar_section_id, $offset, $limit)
 			];
 			$table_section_id[$table] = $ar_section_id;
		}

	// children yacimientos
		/*$temas_children_tables = ['immovables'];
		if (in_array($area_table, $temas_children_tables)) {			
			// resove inverse childrens	

			$ar_fields = ['section_id','titulo as title','resumen as abstract','imagenes_identificativas'];
			$resolve_portals_custom = [
				'imagenes_identificativas' => 'image'
			];

			$options = new stdClass();
				$options->dedalo_get 	= 'records';
				$options->table 		= $area_table; // 'contextos';
				$options->ar_fields 	= $ar_fields;
				$options->lang 			= WEB_CURRENT_LANG_CODE;
				//$options->sql_filter 	= 'parent LIKE \'%"'.$section_id.'"%\'';
				$options->section_id 	= implode(',', json_decode($this->row->immovables));		
				$options->limit 		= 100;
				$options->offset 		= 0;
				$options->order 		= 'section_id ASC';
				$options->resolve_portals_custom = $resolve_portals_custom;
			
			$ar_calls[] = (object)[
				'id' 	  => 'immovables',
				'options' => $options
 			];
		}*/


	// api combi call
		$options = new stdClass();
			$options->dedalo_get 	= 'combi';
			$options->ar_calls 		= $ar_calls;
		# Http request in php to the API
		$response = json_web_data::get_data($options);
			#dump($response->result, ' response ++ '.to_string()); #die();


	// parse rows to unify names
		$data_list = []; // note is an asoc array 
		foreach ($response->result as $key => $element) {
			
			$data_list[$element->id] = array_map(function($row) use($element){
				return yacimientos::parse_row($row, $element->id);
			}, $element->result);

		}


	#die();


