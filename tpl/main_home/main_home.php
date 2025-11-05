<?php


array_pop(page::$css_ar_url);
page::$css_ar_url[] = __WEB_TEMPLATE_WEB__ . '/assets/css/bastida-home.css';

// main_home
	$title 			= $this->get_element_from_template_map('title', $template_map->{$mode});
	$abstract  		= $this->get_element_from_template_map('abstract', $template_map->{$mode});
	$body  			= $this->get_element_from_template_map('body', $template_map->{$mode});
	$ar_image  		= $this->get_element_from_template_map('image', $template_map->{$mode});
	shuffle($ar_image);
	$home_image 	= __WEB_BASE_URL__ . reset($ar_image);
	//$home_image 	= str_replace('1.5MB', 'modificada', $home_image);
	$home_image 	= $home_image;

	$areas_list = yacimientos::get_home_areas_list();
	#dump($areas_list, ' areas_list ++ '.to_string()); die();
