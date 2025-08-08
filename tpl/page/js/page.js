"use strict";
/**
* PAGE JS
*
*
*/
var page = {



	trigger_url : page_globals.__WEB_ROOT_WEB__ + "/tpl/page/trigger.page.php",
	


	setup : function() {
		
		var self = this

		return false
		
		window.ready(function(){
			self.hilite_lang(page_globals.WEB_CURRENT_LANG_CODE)
			self.activate_lang_swicher()
			self.active_nav_area(WEB_AREA)			
		})
		
		return true	
	},



	toggle_menu : function() {

		const nav = document.getElementById("nav")
		if (nav.classList.contains("hide")) {
			nav.classList.remove("hide")			
		}else{
			nav.classList.add("hide")			
		}
	},



	/**
	* ACTIVE_NAV_AREA
	*/
	active_nav_area : function(area_name) {
		
		if (typeof area_name==="undefined") {
			//area_name = page_globals.WEB_AREA.length>0 ? page_globals.WEB_AREA : 'main_home'
			area_name = WEB_AREA.length>0 ? WEB_AREA : 'main_home'
		}
		
		if(SHOW_DEBUG===true) {
			console.log("area_name:",area_name);
		}
	
		const nav 	= document.getElementById("nav")
		if (nav) {
			var item 	= nav.querySelector("[role='"+area_name+"']")
			if (item) {				
				if (item.parentNode.classList.contains("root")) {
					item.classList.add("active")
				}else{
					// search the parent in root to hilite
						item = item.parentNode
						while(!item.parentNode.classList.contains("root")) {
							item = item.parentNode
						}
						item.classList.add("active")
				}				
				return true;
			}
		}
		


		return false
	},



	hilite_lang : function(lang) {
		
		// Lang selected
			const page_lang_selector = document.getElementById("page_lang_selector")			
			if (page_lang_selector) {
				const nodes = page_lang_selector.querySelectorAll("a")
				var search  = "="+lang
				for (var i = 0; i < nodes.length; i++) {					
					if ( nodes[i].href.indexOf(search) !== -1 ) {
						nodes[i].parentNode.classList.add("selected")
					}
				}
			}

		return true
	},



	/**
	* ACTIVATE_LANG_SWICHER
	*/
	activate_lang_swicher : function() {

		const lang_globe = document.getElementById("lang_globe")
		if (lang_globe) {
			lang_globe.addEventListener("click", function(){

				const page_lang_selector = document.getElementById("page_lang_selector")
					console.log("page_lang_selector:",page_lang_selector);
				page_lang_selector.classList.toggle("show_langs")				
			});

			return true
		}			

		return false
	},//end activate_lang_swicher



	/*
	* LOAD_MORE_ITEMS
	*//*
	load_more_items : function(button_obj) {

		var template_map = JSON.parse(button_obj.dataset.template_map)

		var target_div = document.getElementById(button_obj.dataset.target)

		var spinner = document.createElement("div")
			spinner.classList.add("spinner_list")
			target_div.appendChild(spinner)

		const trigger_vars = {
			mode 		 : 'load_more_items',
			template_map : template_map
		}

		const js_promise = common.get_json_data(this.trigger_url, trigger_vars, true).then(function(response){
			//console.log("[page.load_more_items] response", response);

			if (response===null) {
				console.log("[page.load_more_items] Error. Null response");
			}else{
				var list_rows = document.createElement("div")
					list_rows.innerHTML = response.html
				
				var ar_childrens = list_rows.children

				// Add loaded elements to the end of current container
				while(ar_childrens.length>0) {
					// Note that when appendChild is done, element is removed from array ar_childrens
					target_div.appendChild(ar_childrens[0])
				}

				// Update button template_map
				template_map.offset = template_map.offset + template_map.max_records
				button_obj.dataset.template_map = JSON.stringify(template_map)

				// Hide button on arrive to max
				if (template_map.offset >= template_map.total_records) {
					button_obj.style.display = "none"
				}
			}
			spinner.remove()
		})

		return js_promise
	},*/



	/**
	* ADJUST_IMAGE_SIZE
	* Verticalize properties of vertical images (default is horizontal)
	*/
	adjust_image_size : function(image_obj) {

		image_obj.style.opacity = 0;
		var actual_image = document.createElement("img")
			actual_image.src = image_obj.style.backgroundImage.replace(/"/g,"").replace(/url\(|\)$/ig, "")
			actual_image.addEventListener("load", function(e){
				//console.log(e);
				var width  = this.width;
				var height  = this.height;
				//console.log(width, height);

				// Vertical case
				if (height>width) {
					image_obj.classList.add("vertical")

					// Adjust title and body text ?				
				}
				image_obj.style.opacity = 1;
			}, false)

		return true
	},



	/**
	* SHOW_HIDE_HEADER
	* On window scroll, show / hide the header title
	*//*
	show_hide_header : function() {
		
		var toTop = document.querySelector('.navbar-brand')		
		if (toTop) {
			$(toTop).hide().fadeIn(400);
		}

		return true
	},//end show_hide_header
	*/



	/**
	* BUILD_DOCUMENTS_LIST
	* @return 
	*//*
	build_documents_list : function(ar_documents, container) {
		
		console.log("[build_documents_list] ar_documents:",ar_documents);

		var js_promise = new Promise(function(resolve, reject) {

			var ul = common.create_dom_element({
					element_type 	: "ul",
					id 				: "documentos_container",
					parent 			: container
				})

			for (var i = 0; i < ar_documents.length; i++) {
				
				var row 		= ar_documents[i]
				var bg_image 	= row.image

				// li container row
				var li = common.create_dom_element({
						element_type 	: "li",
						parent 			: ul
					})				
					// document_title
					var document_title = common.create_dom_element({
							element_type 	: "div",
							class_name 		: "document_title",
							text_content	 : row.title || '',
							parent 			: li
						})
						var document_date = common.create_dom_element({
								element_type 	: "div",
								class_name 		: "document_date",
								text_content	 : row.evento_fecha || '',
								parent 			: document_title
							})
					// document_thumb
					var document_image = common.create_dom_element({
							element_type 	: "div",
							class_name 		: "document_image",
							parent 			: li
						})
						document_image.style.backgroundImage = "url("+bg_image+")"
			}
		});
		

		return js_promise
	},//end build_documents_list
	*/



	/**
	* BUILD_DOCUMENTS_LIST
	* @return 
	*/
	build_documents_list : function(ar_documents, container, link) {

		// console.log("[build_documents_list] 1 ar_documents:",ar_documents);
		// var container = document.getElementById("documents_list")

		const js_promise = new Promise(function(resolve, reject) {
			
			const ul = common.create_dom_element({
					element_type 	: "ul",
					id 				: "documentos_container",
					parent 			: container
				})

			const doc_length = ar_documents.length
			for (var i = 0; i < doc_length; i++) {
				
				var row = ar_documents[i]

				switch(row.type) {
					case "fragment":
						// Draw li and append to ul
						var li = page.draw_fragment({
							section_id 			 : row.section_id,
							tag_id 				 : row.tag_id,
							interview_section_id : row.interview_section_id,
							caso_section_id 	 : row.caso_section_id,
							term_section_id 	 : row.term_section_id,
							image 				 : common.get_posterframe_from_video(row.video_url),
							video_url 			 : row.video_url,
							title 				 : row.title || '',
							link 				 : link
						}, ul)
						break;
					case "document":
					default:
						// Draw li and append to ul
						page.draw_document({
							section_id 			: row.section_id,
							title 				: row.title,
							fecha 				: row.dating,
							image 				: row.image,
							evento_section_id 	: row.evento_section_id,
							link 				: true
						}, ul)
						break;					
				}
			}

			resolve(ul);
		});

		
		return js_promise
	},//end build_documents_list



	/**
	* BUILD_FRAGMENTS_LIST
	* @return 
	*//**/
	build_fragments_list : function(ar_fragments, container, link) {
		
		// console.log("[build_fragments_list] ar_fragments:",ar_fragments);

		const js_promise = new Promise(function(resolve, reject) {

			var ul = common.create_dom_element({
					element_type 	: "ul",
					id 				: "fragments_container",
					parent 			: container
				})

			const ar_li = []
			const ar_fragments_length = ar_fragments.length
			for (var i = 0; i < ar_fragments_length; i++) {
				
				var row 		= ar_fragments[i]
				var bg_image 	= common.get_posterframe_from_video(row.video_url)
				
				// Draw li and append to ul
				var li = page.draw_fragment({
					section_id 			 : row.section_id,					
					tag_id 				 : row.tag_id,
					interview_section_id : row.interview_section_id,
					caso_section_id 	 : row.caso_section_id,
					evento_section_id 	 : row.evento_section_id,
					term_section_id 	 : row.term_section_id,
					image 				 : bg_image,
					video_url 			 : row.video_url,
					link 				 : link,
					title 				 : '',
					key 				 : i
				}, ul)

				ar_li.push(li)
			}

			resolve(ar_li)
		});
		

		return js_promise
	},//end build_fragments_list



	/**
	* DRAW_FRAGMENT
	* Create html nodes (li and content) to draw a document item
	* @param object fragment
	* @param dom node fragments_container
	*/
	draw_fragment : function(fragment, fragments_container) {

		//console.log("++ draw_fragment fragment:",fragment);
		
		const self = this
	
		const section_id 			= fragment.section_id	
		const image 				= fragment.image
		const title 				= fragment.title
		const video_url 			= fragment.video_url;
		const tag_id 				= fragment.tag_id
		const interview_section_id 	= fragment.interview_section_id
		const term_section_id 		= fragment.term_section_id
		const caso_section_id 		= fragment.caso_section_id
		const evento_section_id 	= fragment.evento_section_id
		const link 					= fragment.link || false
		const key 					= fragment.key
		
		const li = common.create_dom_element({
				element_type	: "li",
				parent 			: fragments_container,
				class_name  	: "",
				data_set 		: {
					section_id 	: section_id,
					tag_id 	   	: tag_id,
					video 		: video_url
				}
			})
			if (link) {
				li.addEventListener("click",function(){
					window.location.href = page_globals.__WEB_ROOT_WEB__ + '/testimonio/' + section_id + "." + tag_id + "." + caso_section_id  + "." + interview_section_id + "." + term_section_id + "." + evento_section_id
				},false)
			}

			//const div_title = common.create_dom_element({
			//	element_type	: "div",
			//	parent 			: li,
			//	class_name  	: "document_title",
			//	text_content 	: title
			//	})				
		
			// fragment_thumb
			const image_div = common.create_dom_element({
				element_type	: "div",
				parent 			: li,
				text_node 		: (key+1),
				class_name  	: "fragment_image"
			})
			image_div.style.backgroundImage = 'url(' + image + ')';


		return li
	},//end draw_fragment



	/**
	* DRAW_DOCUMENT
	* Create html nodes (li and content) to draw a document item
	* @param object documento
	* @param dom node documentos_container
	*/
	draw_document : function(documento, documentos_container) {
	
		const self = this
	
		const section_id 		= documento.section_id
		const title 			= documento.title
		const fecha 			= common.timestamp_to_fecha(documento.fecha)
		const image 			= documento.image
		const evento_section_id = documento.evento_section_id
		const link 				= documento.link || false

		const li = common.create_dom_element({
			element_type	: "li",
			parent 			: documentos_container,
			class_name  	: "",
			data_set 		: {
				section_id : section_id
			}
		})
		if (link) {
			li.addEventListener("click",function(){				
				window.location.href = page_globals.__WEB_ROOT_WEB__ + "/documento/" + evento_section_id +"."+ section_id;
			},false)
		}

		const div_title = common.create_dom_element({
			element_type	: "div",
			parent 			: li,
			class_name  	: "document_title",
			text_content 	: title
			})
			
			const fecha_node = common.create_dom_element({
				element_type	: "div",
				parent 			: div_title,
				class_name  	: "document_date",
				text_content 	: fecha
			})

		const image_div = common.create_dom_element({
			element_type	: "div",
			parent 			: li,
			class_name  	: "document_image"
		})
		image_div.style.backgroundImage = 'url(' + image + ')';


		return li
	},//end draw_document



	/**
	* CONVERT_DRAW_DATA
	* @return 
	*/
	convert_draw_data : function(draw_data) {
		
		console.log("draw_data:",draw_data);
	},//end convert_draw_data



	/**
	* ADJUST_FOOTER_POSITION
	*/
	adjust_footer_position : function() {

		// scrollbar old way
			//const scrollbar = common.has_scrollbar()

		// scrollbar
			let scrollbar = false
			//const top_container = document.querySelector(".top_container")
			const top_container = document.getElementById("wrapper")
			if (top_container) {

				const top_container_height 	= top_container.offsetHeight
				const window_height 		= window.innerHeight

				// console.log("top_container_height:",top_container_height, "window_height",window_height);

				if (top_container_height>window_height) {
					scrollbar = true
				}
			}else{
				console.log("top_container not found !");
				return false
			}
 
		// debug
			if(SHOW_DEBUG===true) {
				console.log("scrollbar:",scrollbar);
			}	

		// footer
			const footer = document.getElementById("footer")
			if (scrollbar===false) {
				footer.classList.add("fixed")
			}else{
				footer.classList.remove("fixed")
			}

		return scrollbar
	}//end adjust_footer_position



}//end page

page.setup()