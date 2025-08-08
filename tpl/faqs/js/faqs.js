"use strict";



var faqs =  {


	limit : 0,
	data_list : [],


	setup : function(options) {
	
		// console.log("options:",options);
		
		const self = this

		// set data_list
		self.data_list = options.data_list

		const table = 'faqs'
		
		// build every list		
		//self.build_list(table, self.data_list)	
		
		self.build_list(table, self.data_list)

		
		// // images colorbox (https://www.jacklmoore.com/colorbox/)
		// 	$('a.gallery').colorbox({
		// 		rel:'gal',
		// 		close : " X ",
		// 		previous : " < ",
		// 		next : " > ",
		// 		current : "Imagen {current} de {total}",
		// 		maxHeight : "98%",
		// 		maxWidth : "98%",
		// 		retinaImage : false,
		// 		slideshow : false
		// 	});

		return true
	},//end set_up



	/**
	* BUILD_LIST
	*/
	build_list : async function(table, rows, loading_more=false) {

		const self = this

		// debug
			if(SHOW_DEBUG===true) {
				// console.log("table rows:", table, rows);;
			}
		
		const rows_length = rows.length		
		if (rows_length<1) return

		// table_div list wrapper
			const table_div = document.getElementById(table) || common.create_dom_element({
				id 				: table,
				element_type 	: "div",
				class_name 		: "list",
				parent 			: document.getElementById('portals_list')
			})
		// custom style
			let class_name 	   = 'spotlight style1 orient-right content-align-left image-position-center onscroll-image-fade-in' // onload-image-fade-in

	

		for (let i = 0; i < rows_length; i++) {
		
			const row = rows[i]
		

			const section = common.create_dom_element({
					element_type 	: "section",
					class_name 		: class_name + " image_list",
					parent 			: table_div
			})	
					
			const content = common.create_dom_element({
					element_type 	: "div",
					class_name 		: "content",
					parent 			: section
				})

				const question_icon = common.create_dom_element({
						element_type 	: "i",
						class_name 		: "far fa-question-circle questions-icons left-align-text",
						parent 			: content
				})

				const pregunta = common.create_dom_element({
						element_type 	: "p",
						class_name 		: "left-align-text question",
						inner_html 	 	: row.pregunta,
						parent 			: content
				})

				const reveal_icon = common.create_dom_element({
						element_type 	: "i",
						class_name 		: "fas fa-sort-down questions-icons left-align-text",
						parent 			: content
				})

				const respuesta = common.create_dom_element({
						element_type 	: "p",
						class_name 		: "answer hide justify-text",
						inner_html 	 	: row.respuesta,
						parent 			: content
				})

				section.addEventListener("click", function(e){

					if (!respuesta.classList.contains("hide")){
						respuesta.classList.add("hide");
					}  else {
						respuesta.classList.remove("hide");

					}

					var answer_elements = document.getElementsByClassName("answer");
					for (let i=0;i<answer_elements.length;i++){
						if (answer_elements[i] !== respuesta){
							answer_elements[i].classList.add("hide");
							answer_elements[i].previousSibling.style.transform = "rotate(0deg)";
							answer_elements[i].previousSibling.classList.remove("rotate-icon");
						}
					}

					if (window.getComputedStyle(respuesta).display === "none"){
						reveal_icon.style.transform = "rotate(0deg)";
						reveal_icon.classList.remove("rotate-icon");
					} else {
						reveal_icon.style.transform = "rotate(180deg)";
						reveal_icon.classList.add("rotate-icon");
					}

				})

		}
		

		return table_div
	}//end build_list



}//end faqs