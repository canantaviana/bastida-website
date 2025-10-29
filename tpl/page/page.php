<?php
# Controller
	include( dirname(__FILE__) . '/class.yacimientos.php' );


	# base_links
		$base_links = common::get_base_links();
		define('BASE_LINKS', $base_links);


	# breadcrumb
		$this->breadcrumb = [];



	# css
		page::$css_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/css/main.css';		
		page::$css_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/lib/jquery-colorbox/example4/colorbox.css';
		page::$css_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/css/page.css';


	# js		
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/js/jquery.min.js';		
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/js/jquery.scrollex.min.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/js/jquery.scrolly.min.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/js/browser.min.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/js/breakpoints.min.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/js/util.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/js/main.js';


		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/lib/jquery-colorbox/jquery.colorbox-min.js';
		page::$js_ar_url[] = __WEB_ROOT_WEB__ . '/' . WEB_APP_DIR . '/common/js/common'.JS_SUFFIX.'.js';
		page::$js_ar_url[] = __WEB_ROOT_WEB__ . '/' . WEB_APP_DIR . '/factory/form_factory.js';
		page::$js_ar_url[] = __WEB_ROOT_WEB__ . '/' . WEB_APP_DIR . '/factory/list_factory.js';
		page::$js_ar_url[] = __WEB_ROOT_WEB__ . '/' . WEB_APP_DIR . '/factory/map_factory.js';
		page::$js_ar_url[] = __WEB_ROOT_WEB__ . '/' . WEB_APP_DIR . '/factory/tree_factory.js';
		page::$js_ar_url[] = __WEB_ROOT_WEB__ . '/' . WEB_APP_DIR . '/factory/timeline_factory.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/js/app_utils-min.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/js/page.js.php';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/js/render_page.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/js/data.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/js/data_export.js';

	
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/js/api.js';
		page::$js_ar_url[] = __WEB_TEMPLATE_WEB__ . '/page/js/modules.js';

	// menu tree
		$menu_tree = $this->get_menu_tree_plain(WEB_MENU_PARENT); // 
		#dump($menu_tree, ' menu_tree ++ '.to_string());
		// Fix to recover from content
			$this->menu_tree = $menu_tree;
		
		// ul drawer
			$ul_drawer = function($term_id, $html) {
				if($term_id===WEB_MENU_PARENT) {
					$html = PHP_EOL . '<ul class="links root">'.$html.'</ul>';
				}else{
					$html = PHP_EOL . '<ul class="links links_inside">'.$html.'</ul>';
				}

				return $html;
			};
		
		// li drawer
			$li_drawer = function($menu_element, $embed_html='') {				
				$html  = '';
				// exclude from menu some auxiliar items (needed for other methods)
				if (in_array($menu_element->section_id, MENU_SKIP_TERMS)) {
					return $html;
				}
				
				$term = stripos($menu_element->term, 'faqs')!==false
					? $menu_element->term
					: str_replace(' Bastida', '', $menu_element->term);			

				$html .= PHP_EOL . '<li role="'.$menu_element->web_path.'">';
				if ($menu_element->web_path==='' || $menu_element->web_path=== null) {
					$html .= '<a href="#" class="no_menu">'.$term.'<i class="fas fa-angle-down"></i></a>';
				}else{
					$web_path = ($menu_element->web_path==='main_home' && $menu_element->parent===WEB_MENU_PARENT) ? '' : $menu_element->web_path;
					$html .= '<a href="'.__WEB_ROOT_WEB__.'/'.$web_path.'">'.$term.'</a>';
				}
				$html .= $embed_html;
				$html .= '</li>';

				#if ($menu_element->section_id==7) {
				#	$html = '<ul class="links links_inside">'.$html.'</ul>';
				#}

				return $html;
			};
		
		// menu_tree_html
			$menu_tree_html = page::render_menu_tree_plain(WEB_MENU_PARENT, $menu_tree, $li_drawer, $ul_drawer);
				#dump($menu_tree_html, ' menu_tree_html ++ '.to_string(WEB_MENU_PARENT));


	// globalpage info from DDBB
		# $options = new stdClass();
		# 	$options->dedalo_get 	= 'records';
		# 	$options->lang 			= WEB_CURRENT_LANG_CODE;
		# 	$options->table 		= WEB_MENU_TABLE;
		# 	$options->ar_fields 	= ['*'];
		# 	$options->sql_filter 	= 'term_id = \'' .WEB_MENU_PARENT .'\'';
		# 	$options->limit 		= 1;
		# 
 		# # Http request in php to the API
		# $page_data 			= json_web_data::get_data($options);
		# $page_vars 			= reset($page_data->result);
	
		$page_vars = array_reduce($this->data_combi, function($carry, $item){
			if ($item->id==='menu_all') {
				return array_reduce($item->result, function($carry2, $item2){
					return ($item2->term_id===WEB_MENU_PARENT) ? $item2 : $carry2;
				});
			}
			return $carry;
		});
		#dump($page_vars, ' page_vars ++ '.to_string());
		#dump($this->data_combi, ' this->data_combi ++ '.to_string());
		
		$page_template_name = $page_vars->template_name;
		
		// page template
			// select template from loaded templates
			$page_template_map = array_reduce($this->template_map, function($carry, $item) use($page_template_name){
				if($item->template===$page_template_name) {
					return $item;
				}
				return $carry;
			});
			if (empty($page_template_map)) {
				if (empty($this->template_map)) {
					throw new Exception("Error Processing Request. global template_map is empty", 1);	
				}else{
					dump($page_template_name, ' $page_template_name ++ '.to_string());					
					dump($this->template_map, ' this->template_map ++ '.to_string());
					throw new Exception("Error Processing Request. current page template_map is empty", 1);	
				}
			}
			// resolve template values (detail)
				foreach ($page_template_map->detail as $key => $column_obj) {
					$this->resolve_column_value( $column_obj, $page_vars );
				}
				#dump($page_template_map->detail, ' page_template_map->detail ++ '.to_string());
		
		// page globals vars
			$page_global_title 			= $this->get_element_from_template_map('title', $page_template_map->detail);
			$page_global_body 			= $this->get_element_from_template_map('body', $page_template_map->detail);
			#$page_global_address 		= $this->get_element_from_template_map('address', $page_template_map->detail);
			#$page_global_telf 			= $this->get_element_from_template_map('telf', $page_template_map->detail);
			#$page_global_email 			= $this->get_element_from_template_map('email', $page_template_map->detail);
			// logos
				# $page_global_logos_image 	= $this->get_element_from_template_map('image', $page_template_map->detail, [
				# 	'name' => 'logos_image'
				# ]);
				# $page_global_logos_title 	= $this->get_element_from_template_map('image', $page_template_map->detail, [
				# 	'name' => 'logos_title'
				# ]);
				# $page_global_logos_link 	= $this->get_element_from_template_map('image', $page_template_map->detail, [
				# 	'name' => 'logos_link'
				# ]);
				#dump($page_global_telf, ' page_global_telf ++ '.to_string());
			#dump($page_template_map->detail, ' page_template_map->detail ++ '.to_string());
				#dump($page_global_body, ' page_global_body ++ '.to_string());
			

	# footer_html
		ob_start();
		include(__WEB_TEMPLATE_PATH__ .'/page/html/footer.phtml');
		$this->footer_html = ob_get_clean();


	# nav_html
		ob_start();
		include(__WEB_TEMPLATE_PATH__ .'/page/html/nav.phtml');
		$this->nav_html = ob_get_clean();
	

	# header_html
		ob_start();
		include(__WEB_TEMPLATE_PATH__ .'/page/html/header.phtml');
		$this->header_html = ob_get_clean();

	
	# content_html	
		$content_options = new stdClass();
			$content_options->template_map 		= $template_map; // Defined in method page->render_page_html
			$content_options->mode 				= $mode; // Defined in method page->render_page_html
			$content_options->add_common_css 	= false;
			$content_options->add_template_css 	= true;
			$content_options->resolve_values 	= true;
	
		$content_html = $this->get_template_html($content_options);	
	

	# page title
		#if(isset($this->row->term)) {
		#	$this->page_title = $this->row->term;
		#}
		$page_title = $this->get_page_title();
	
	
	# build links css/js
		$css_links 	= $this->get_header_links('css');
		$js_links 	= $this->get_header_links('js');


