<?php


class yacimientos {



	/**
	* GET_HOME_AREAS_LIST
	* @return array $areas_list
	*/
	public static function get_home_areas_list() {
		
		// Areas . Resolve home areas and childrens
			$options = new stdClass();
				$options->dedalo_get 	= 'records';
				$options->table 		= WEB_MENU_TABLE;
				$options->ar_fields 	= '*'; // array_values(get_object_vars(self::$web_fields_map));;
				$options->lang 			= WEB_CURRENT_LANG_CODE;
				$options->order 		= 'norder ASC';
				$options->resolve_portals_custom = [
					'image' => 'image'
				];
				$response = json_web_data::get_data($options);
				#dump($response, ' response ++ '.to_string());

			$create_item = function($item) {
				return (object)[
					'section_id' 	=> $item->section_id,
					'term' 			=> $item->term,
					'title' 		=> $item->title,
					'abstract' 		=> $item->abstract,
					'web_path' 		=> $item->web_path,
					'childrens' 	=> [],
					'image' 		=> !empty($item->image) ? __WEB_BASE_URL__ . reset($item->image)->image : null
				];
			};

			$areas_list = [];
			#foreach ($this->menu_tree as $item) {
			foreach ($response->result as $key => $item) {
				if ($item->parent!==WEB_MENU_PARENT || $item->web_path==='main_home') continue;				

				$element = $create_item($item);

				if (!empty($item->childrens)) {

					$childrens = array_filter($response->result, function($el) use($item){					
						if ($el->parent===WEB_MENU_SECTION_TIPO.'_'.$item->section_id) {
							return $el;							
						}
					});
					#dump($childrens, ' childrens 1 ++ '.to_string());

					$childrens = array_map(function($el) use($item, $create_item){
						if ($el->parent===WEB_MENU_SECTION_TIPO.'_'.$item->section_id) {							
							return $create_item($el);
						}						
					}, $childrens);
					#dump($childrens, ' childrens ++ '.to_string());

					$element->childrens = $childrens;
				}//end if (!empty($item->childrens))


				$areas_list[] = $element;

			}//end foreach ($this->menu_tree as $item)
			#dump($areas_list, ' areas_list ++ '.to_string());

		return $areas_list;
	}//end get_home_areas_list



	/**
	* GET_SEARCH_OPTIONS_FROM_TABLE
	* @return array $sr_records
	*/
	public static function get_search_options_from_table($table, $ar_section_id, $offset=0, $limit=5) {

		// filter by section_id
			$sql_filter = implode(' OR ', array_map(function($current_section_id){
				return 'section_id=' . (int)$current_section_id;
			}, $ar_section_id));

		// order
			$order = 'FIELD(`section_id`, '.implode(',', $ar_section_id).')';

		// custom search params
			switch ($table) {
				case 'actividades':
					$ar_fields = ['section_id','titulo AS title','resumen AS abstract','imagen_identificativa_list_id'];
					$resolve_portals_custom = [
						'imagen_identificativa_list_id' => 'ephemera'
					];
					$order = 'section_id DESC';
					break;
				case 'galeria_digital':
					$ar_fields = ['section_id','titulo AS title','descripcion AS abstract','imagen_identificativa_id'];
					$resolve_portals_custom = [
						'imagen_identificativa_id' => 'digital'
					];
					break;				
				case 'galeria_ephemera':
					$ar_fields = ['section_id','titulo AS title','descripcion AS abstract','imagen_identificativa_id'];
					$resolve_portals_custom = [
						'imagen_identificativa_id' => 'ephemera'
					];
					break;
				case 'galeria_video':
					$ar_fields = ['section_id','titulo AS title','tipologia_label AS abstract','video_id'];
					$resolve_portals_custom = [
						'video_id' => 'video'
					];
					break;
				case 'galeria_audio':
					$ar_fields = ['section_id','titulo AS title','tema_label AS abstract','audio_id'];
					$resolve_portals_custom = [
						'audio_id' => 'audio'
					];
					break;
				case 'catalogo':
					$ar_fields = ['section_id','titulo AS title','descripcion AS abstract','imagen_identificativa_id'];
					$resolve_portals_custom = [
						'imagen_identificativa_id' => 'catalogo_imagenes'
					];
					break;
				case 'contextos':
				case 'espacios':
				case 'excavaciones':
				case 'yacimientos':
					$ar_fields = ['section_id','titulo AS title','resumen AS abstract','imagen_identificativa_id'];
					$resolve_portals_custom = [
						'imagen_identificativa_id' => 'digital'
					];
					break;
				case 'faqs':
					$ar_fields = ['section_id','pregunta','respuesta'];
					$resolve_portals_custom = false;
					break;							
				case 'tematicas':
					$ar_fields = ['section_id','titulo AS title','descripcion AS abstract', 'galeria_digital'];
					$resolve_portals_custom = [
						'galeria_digital' => 'galeria_digital',
						'galeria_digital.imagen_identificativa_id' => 'digital'
					];					
					break;
				case 'publicaciones':
				case 'publicaciones_externas':
					$ar_fields = ['section_id','titulo AS title','autor_label AS abstract','imagen_identificativa'];
					$resolve_portals_custom = false;
					break;
				default:
					$ar_fields = '*';
					$resolve_portals_custom = false;
					break;
			}
		
		$options = new stdClass();
			$options->dedalo_get 	= 'records';
			$options->table 		= $table;					
			$options->ar_fields 	= $ar_fields;
			$options->lang 			= WEB_CURRENT_LANG_CODE;
			$options->sql_filter 	= $sql_filter;
			$options->order 		= $order;
			$options->limit 		= $limit;
			$options->offset 		= $offset;
			$options->resolve_portals_custom = $resolve_portals_custom;	

		
		return $options;
	}// get_search_options_from_table


	/**
	* GET_RECORDS_FROM_TABLE
	* @return array $sr_records
	*//*
	public static function get_records_from_table($table, $fields, $ar_section_id, $offset, $limit, $resolve_portals_custom=false) {
		
		$sql_filter = implode(' OR ', array_map(function($current_section_id){
			return 'section_id=' . (int)$current_section_id;
		}, $ar_section_id));

		$options = new stdClass();
			$options->dedalo_get 	= 'records';
			$options->table 		= $table;					
			$options->ar_fields 	= $fields;
			$options->lang 			= WEB_CURRENT_LANG_CODE;
			$options->sql_filter 	= $sql_filter;
			$options->order 		= 'FIELD(`section_id`, '.implode(',', $ar_section_id).')';
			$options->resolve_portals_custom = $resolve_portals_custom;
	
		$response = json_web_data::get_data($options);
			dump($response, ' response ++ '.to_string());

		$ar_records = $response->result;
		
		return $ar_records;
	}//end get_records_from_table
	*/


	/**
	* GET_PORTAL_DATA
	* @return 
	*//*
	public static function get_portal_data($ar_section_id, $table, $ar_fields='*', $resolve_portals_custom=false) {

		$filter = implode(' OR ', array_map(function($current_section_id){
			return 'section_id=' . (int)$current_section_id;
		}, $ar_section_id));
		
		$options = new stdClass();
			$options->dedalo_get 			 = 'records';
			$options->table 				 = $table;
			$options->ar_fields 			 = $ar_fields;
			$options->lang 					 = WEB_CURRENT_LANG_CODE;
			$options->sql_filter 			 = $filter;
			$options->order 				 = 'FIELD(`section_id`, '.implode(',', $ar_section_id).')';
			$options->resolve_portals_custom = $resolve_portals_custom;
			
		$response = json_web_data::get_data($options);
			#dump($response, ' response ++ '.to_string());

		return $response;
	}//end get_portal_data
	*/



	/**
	* PARSE_ROW
	* @return object
	*/
	public static function parse_row($row, $table) {
		
		switch ($table) {
			case 'actividades':
				$row->table = $table;
				$row->image = isset($row->imagen_identificativa_list_id[0]->imagen_identificativa) ? __WEB_BASE_URL__ . $row->imagen_identificativa_list_id[0]->imagen_identificativa : null;
				#$row->image = str_replace(['/1.5MB/'], ['/modificada/'], $row->image);
				unset($row->imagen_identificativa_list_id);
				break;
			case 'galeria_digital':
			case 'catalogo':
				$row->table = $table;
				$row->image = isset($row->imagen_identificativa_id[0]->imagen) ? __WEB_BASE_URL__ . $row->imagen_identificativa_id[0]->imagen : null;
				unset($row->imagen_identificativa_id);
				break;
			case 'galeria_ephemera':
				$row->table = $table;
				$row->image = isset($row->imagen_identificativa_id[0]->imagen_identificativa) ? __WEB_BASE_URL__ . $row->imagen_identificativa_id[0]->imagen_identificativa : null;
				unset($row->imagen_identificativa_id);
				break;
			case 'galeria_video':
				$row->table = $table;
				$row->video = isset($row->video_id[0]->audiovisual) ? __WEB_BASE_URL__ . $row->video_id[0]->audiovisual : null;
				$row->image = str_replace(['/404/','.mp4'], ['/posterframe/','.jpg'], $row->video);
				unset($row->video_id);
				break;
			case 'galeria_audio':
				$row->table = $table;
				$row->audio = isset($row->audio_id[0]->audiovisual) ? __WEB_BASE_URL__ . $row->audio_id[0]->audiovisual : null;
				$row->image = null; //str_replace(['/404/','.mp4'], ['/posterframe/','.jpg'], $row->video);
				unset($row->audio_id);
				break;	
			case 'contextos':
			case 'espacios':
			case 'excavaciones':
			case 'yacimientos':
				$row->table = $table;
				$row->image = isset($row->imagen_identificativa_id[0]->imagen) ? __WEB_BASE_URL__ . $row->imagen_identificativa_id[0]->imagen : null;
				unset($row->imagen_identificativa_id);
				break;
			case 'publicaciones':
			case 'publicaciones_externas':
				$row->table = $table;
				$row->image = isset($row->imagen_identificativa) ? __WEB_BASE_URL__ . $row->imagen_identificativa : null;
				unset($row->imagen_identificativa);
				break;
			case 'tematicas':
				#dump($row, ' row ++ '.to_string());
				$row->table = $table;
				$row->image = (isset($row->galeria_digital[0]) && isset($row->galeria_digital[0]->imagen_identificativa_id[0]->imagen)) ? __WEB_BASE_URL__ . $row->galeria_digital[0]->imagen_identificativa_id[0]->imagen : null;
				unset($row->galeria_digital);
				if (strpos($row->abstract, '</p>')!==false) {
					$row->abstract = substr($row->abstract, 0 ,strpos($row->abstract, '</p>')+4);
				}elseif (strpos($row->abstract, '<br>')!==false) {
					$row->abstract = substr($row->abstract, 0 ,strpos($row->abstract, '<br>')+4);
				}				
				break;			
			default:
				break;
		}


		$result = $row;
	
		return $result;
	}//end parse_row



	/**
	* GET_TEMAS_CHILDREN
	* @return 
	*/
	public static function get_temas_children($parent_section_id) {
		
		$table = 'tematicas';

		$options = new stdClass();
			$options->dedalo_get 	= 'records';
			$options->table 		= $table;
			$options->ar_fields 	= '*'; // [$galeria->target->colname]
			$options->lang 			= WEB_CURRENT_LANG_CODE;
			$options->sql_filter 	= 'padre_id LIKE \'%"'.$parent_section_id.'"%\'';
			#$options->resolve_portals_custom = $galeria->resolve_portals_custom;
				#dump($options, ' options ++ '.to_string());
			$response = json_web_data::get_data($options);
				dump($response, ' response ++ '.to_string($parent_section_id));

	}//end get_temas_children



	/**
	* GET_GALLERY_DATA
	* @return array $result
	*//* NOT USED
	public static function get_gallery_data($template_map) {

		$galeria = array_reduce($template_map, function($acc, $item){
			return $item->type==='gallery' ? $item : $acc;
		});
			#dump($galeria, ' galeria ++ '.to_string());
		if (!empty($galeria) && !empty($galeria->value)) {
			// resolve
			$ar_section_id = json_decode($galeria->value);
			$ar_filter = array_map(function($item){
				return 'section_id=' . (int)$item;
			}, $ar_section_id);
			$options = new stdClass();
				$options->dedalo_get 	= 'records';
				$options->table 		= $galeria->target->table;
				$options->ar_fields 	= '*'; // [$galeria->target->colname]
				$options->lang 			= WEB_CURRENT_LANG_CODE;
				$options->sql_filter 	= implode(' OR ', $ar_filter);
				$options->resolve_portals_custom = $galeria->resolve_portals_custom;
					#dump($options, ' options ++ '.to_string());
				$response = json_web_data::get_data($options);
					#dump($response, ' response ++ '.to_string());
			
			$result = $response->result;
		}		
		#dump($result, ' result ++ '.to_string());

		return $result ?? false;
	}//end get_gallery_data
	*/


}