"use strict";



var generic =  {


	limit : 5,
	data_list : [],


	setup : function(options) {
		
		console.log("options:",options);
		
		const self = this

		// set data_list
		self.data_list = options.data_list

		// set
		self.table_section_id = options.table_section_id

		self.limit = options.limit
		
		// build every list		
		for (let table in self.data_list) {
			self.build_list(table, self.data_list[table])
		}
		

		// images colorbox (https://www.jacklmoore.com/colorbox/)
			$('a.gallery').colorbox({
				rel:'gal',
				close : " X ",
				previous : " < ",
				next : " > ",
				current : "Imagen {current} de {total}",
				maxHeight : "98%",
				maxWidth : "98%",
				retinaImage : false,
				slideshow : false
			});

		return true
	},//end set_up



	/**
	* BUILD_LIST
	*/
	build_list : async function(table, rows, loading_more=false) {

		const self = this

		// debug
			if(SHOW_DEBUG===true) {
				console.log("table rows:", table, rows);;
			}
		
		const rows_length = rows.length		
		if (rows_length<1) return

		const table_section_id 	= self.table_section_id[table] || []		
		const total_rows 		= table_section_id.length;	

		// table_div list wrapper
			const table_div = document.getElementById(table) || common.create_dom_element({
				id 				: table,
				element_type 	: "div",
				class_name 		: "list",
				parent 			: document.getElementById('portals_list')
			})

		// custom style
			let class_name 	   = 'spotlight style1 orient-right content-align-left image-position-center onscroll-image-fade-in' // onload-image-fade-in
			switch(table){
				case 'contextos':
					class_name = 'spotlight style2 orient-right content-align-left image-position-center onscroll-image-fade-in onload-image-fade-in';
					break
				case 'tematicas':
					class_name = 'spotlight style2 orient-left content-align-left image-position-center onscroll-image-fade-in onload-image-fade-in';
					break
			}
			//class_name = " banner onload-image-fade-in"
			//class_name = "spotlight onscroll-image-fade-in"

		// iterate rows to render
			for (let i = 0; i < rows_length; i++) {
				
				const row = rows[i]

				// section wrapper
				const section = common.create_dom_element({
					element_type 	: "section",
					class_name 		: class_name + " image_list",
					parent 			: table_div
				})				
				// set scrollex 
				$(section).scrollex({
					top:		'20vh',
					bottom:		'20vh',
					initialize:	function() {
						$(this).addClass('is-inactive');
					},
					terminate:	function() {
						$(this).removeClass('is-inactive');
					},
					enter:		function() {
						$(this).removeClass('is-inactive');
					},
					leave:		function() {
						var $this = $(this);
						//if ($this.hasClass('onscroll-bidirectional'))
							$this.addClass('is-inactive');
					}
				});				

				// force scroll to first
				if (i===0 && loading_more===true) {
					section.scrollIntoView();
				}					

				// content
				const content = common.create_dom_element({
					element_type 	: "div",
					class_name 		: "content",
					parent 			: section
					})

					const title = common.create_dom_element({
						element_type 	: "h2",
						inner_html 		: row.title,
						parent 			: content
					})

					const abstract = common.create_dom_element({
						element_type 	: "p",
						inner_html 	 	: row.abstract,
						parent 			: content
					})

					// ver mas											
						const ul = common.create_dom_element({
							element_type 	: "ul",
							class_name 	 	: "actions stacked",
							parent 			: content
						})
						const li = common.create_dom_element({
							element_type 	: "li",
							parent 			: ul
						})
						const a = common.create_dom_element({
							element_type 	: "a",
							class_name 	 	: "button",
							inner_html 		: tstring['ver_mas']|| 'View more',
							parent 			: li
						})						
						a.addEventListener("click", function(e){
							self.goto_detail(table, row.section_id, loading_more)
						})
				

				// image
				if (row.image) {
					const image_div = common.create_dom_element({
						element_type 	: "div",
						class_name 		: "image", // banner image spotlight image
						parent 			: section
						})						
						image_div.addEventListener("click", function(e){
							self.goto_detail(table, row.section_id, loading_more)
						})
							

						const image = common.create_dom_element({
							element_type 	: "img",
							src 			: row.image,
							parent 			: image_div
						})
				}				
			}

		// load more button	
			const total_showed_rows = table_div.querySelectorAll("section").length
			if (total_rows>total_showed_rows) { //  && !table_div.querySelector("a.button")
				
				const ul = common.create_dom_element({
					element_type 	: "ul",
					class_name 		: "actions stacked",
					parent 			: table_div
					})
				const li = common.create_dom_element({
					element_type 	: "li",
					parent 			: ul
					})

				const load_more = common.create_dom_element({
					element_type 	: "a",
					class_name 		: "button",
					inner_html 		: tstring['ver_mas'] || 'View more',
					parent 			: li
				})
				.addEventListener("click", (e) => {
					//const offset = table_div.childNodes.length - 1 // remove itself from childs
					const offset = total_showed_rows					
					self.load_more_items(table, table_section_id, offset, ul).then(function(response){
						if (response) {
							ul.remove() // remove me
						}						
					})
				})
			}


		return table_div
	},//end build_list



	/**
	* LOAD_MORE_ITEMS
	*/
	load_more_items : function(table, table_section_id, offset, button){

		const self = this

		// debug
			if(SHOW_DEBUG===true) {
				console.log("table, table_section_id, offset, button:",table, table_section_id, offset, button); 
			}

		// element.parentNode.insertBefore(newElement, element);

		const list_div = button.parentNode

		// spinner
		//var spinner = document.createElement("div")
		//	spinner.classList.add("spinner_list")
		//	list_div.insertBefore(spinner, button);
			
		const trigger_url  = page.trigger_url
		const trigger_vars = {
			mode 		  	: 'load_more_items',
			table 			: table,
			ar_section_id 	: table_section_id,
			offset 			: offset,
			limit 			: self.limit
		}

		const js_promise = common.get_json_data(trigger_url, trigger_vars, true).then(function(response){
						
			//spinner.remove()
			
			if (response===null) {
				
				console.warn("[generic.load_more_items] Error. Null response");
			
			}else{

				const rows = response.result

				// build_list
				self.build_list(table, rows, true)				
			}

			return response
		})

		return js_promise
	},//end load_more_items



	/**
	* GOTO_DETAIL
	*/
	goto_detail : function(table, section_id, loading_more) {
		
		const href = page_globals.__WEB_ROOT_WEB__ + '/'+ WEB_AREA + '/' + table + '/' + section_id
		
		if (loading_more===true) {
			window.open(href, '_blank');
		}else{
			window.location = href;
		}

		return true
	}//end goto_detail




}//end generic