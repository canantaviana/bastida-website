<?php
// Get file and send as image hidding real image path		


	// image selection random number
		#$min  = 1;
		#$max  = 3;
		#$id   = rand($min,$max);
		#
		#$base_path 	= dirname(__FILE__) . '/bg_images';
		#$file_name  = $id . '.jpg';
		#$file 		= $base_path .'/'. $file_name;
			

	// image selection reading dir
		$imagesDir 	= dirname(__FILE__) . '/bg_images/';
		$images 	= glob($imagesDir . '*.{jpg}', GLOB_BRACE);
		$file_name 	= $images[array_rand($images)];
		$file 		= $file_name; // $imagesDir  . $file_name;

	
	// Check file exists
		if (!file_exists($file)) {
			// File not found in dir
			header("HTTP/1.0 404 Not Found");
			echo "Image not found in dir";
			exit();
		}


	// Set zone time
		date_default_timezone_set('Europe/Madrid');


	// Headers		
		//header("Cache-Control: private, max-age=10800, pre-check=10800");
		//header("Pragma: private");
		//header("Expires: " . date(DATE_RFC822,strtotime(" 120 day")));
		header('Content-Type: image/jpeg');

	// expires headers. example 60*60*24 for one day
		$expires_secs = 60 ;// 60*60*24*14; // in seconds
		header("Pragma: public");
		header("Cache-Control: maxage=".$expires_secs);
		header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires_secs) . ' GMT');
		

	// Direct read file
		header('Content-Length: ' . filesize($file));
		readfile($file);

