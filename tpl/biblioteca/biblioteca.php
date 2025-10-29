<?php

// bibio


// css
	// Prepend this style to the beginning of 'page::$css_ar_url' array to decrease its prevalence
		array_unshift(page::$css_ar_url,
			__WEB_TEMPLATE_WEB__ . '/assets/lib/jquery-ui/jquery-ui.min.css'
		);


// js
	page::$js_ar_url[]	= __WEB_TEMPLATE_WEB__ . '/assets/lib/jquery-ui/jquery-ui.min.js';


// page basic vars
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
