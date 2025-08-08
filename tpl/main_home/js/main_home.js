"use strict";


var main_home =  {

	
	setup : function(options) {

		// Activate show_hide_header
			this.show_hide_header()
			
		return true
	},//end setup



	/**
	* SHOW_HIDE_HEADER
	* On window scroll, show / hide the header title
	*/
	show_hide_header : function() {

		const wrapper = document.getElementById("wrapper")
		
		//var $toTop  = $('.navbar-brand');
		const $toTop  	= $('.top_bar')//.hide();
		// $toTop.css('opacity',0);

		//const $toTop = document.querySelector('.top_bar')
		//var $links_root = $('ul.links.root');

		//const page_lang_selector = document.getElementById('page_lang_selector')
		//const page_lang_selector = document.getElementById('page_lang_selector').cloneNode(true);
		//wrapper.appendChild(page_lang_selector)
		//wrapper.insertBefore(page_lang_selector, wrapper.firstChild);

		var changing = false

	
		const view_point = Math.floor(window.innerHeight / 2)
		//$(wrapper).scroll(function () {
		$( window ).scroll(function() {
				
			if ($(this).scrollTop() > view_point) {
				
				if (changing===false) {	
					changing = true
					$toTop.fadeIn(150, function() {
						changing = false
					});
					// $toTop.css('opacity',0).animate({'opacity': 1}, 150);
					// changing = false
					//$links_root.show();
					//console.log("fadeIn top_bar: ", changing);
				}

			} else if ($toTop.is(':visible')) {

				if (changing===false) {	
					changing = true
					$toTop.fadeOut(150, function() {
						changing = false
					});
					// $toTop.css('opacity',1).animate({'opacity': 0}, 150);
					// changing = false
					//$links_root.hide();
					//console.log("hided top_bar: ", changing);
				}
			}
			
		});

		return true
	},//end show_hide_header


}