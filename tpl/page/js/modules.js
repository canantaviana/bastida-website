"use strict";

var templateModules = {

    fix_names: function(text) {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replaceAll(' ', '_');
    },

    render_items: function (rows, term_id) {
        const self = this;
        const elems = rows.filter(function(elem){
            return elem.parent == term_id && elem.template_name != null
        })
        return elems.map(function(elem){
            var template = self.fix_names(elem.template_name);
            var templates = template.split('+');
            if (templates.length > 1) {
                template = templates.shift();
                var copy = structuredClone(elem)
                copy.template_name = templates.join('+');
                copy.parent = elem.term_id;
                copy.term_id = elem.term_id+'_v2';
                rows.push(copy);

                return self[template](elem, rows);
            }
            if (!self.hasOwnProperty(template)) {
                return null;
            }
            return self[template](elem, rows);
        }).filter(function(elem){
            return elem !== null;
        });
    },


    bloque_actividades_anuales: function(target) {
        const content = htmlTemplate(`
            <div class="children_container accordion accordion--primary mt-6">
                <h2 class="is-flex is-align-items-center gap-2 mb-7 has-text-black">${tstring.historical}</h2>
            </div>
        `);
        var children_container = content[0];
        const spinner = common.spinner(children_container)
        appendTemplate(target, content);

        api.getActivitiesYears().then(function(results){
            if (!results || results.length == 0) return;
            const yearsArray = results.map(el => el.date_start_year);

            Promise.all(
                yearsArray.map(year => api.getActivitiesByYear(year).then(activities => ({ year, activities })))
            ).then(yearsWithActivities => {
                const html = yearsWithActivities.map(({ year, activities }) => {
                    if (!activities || activities.length == 0) return '';

                    return `
                        <h2 class="accordion-header" id="tab${year}">
                            <button type="button" aria-controls="panel${year}">${year}</button>
                        </h2>
                        <div class="accordion-content" id="panel${year}" aria-labelledby="tab${year}">
                            <div class="swiper-container is-relative">
                                <div class="swiper swiper--activitats swiper--activitats-${year}">
                                    <div class="swiper-wrapper">
                                        ${
                                            activities.map(function(row){
                                                const url = page_globals.__WEB_ROOT_WEB__ + '/' + row.tpl + '/' + row.section_id;
                                                var image_url = '/assets/img/placeholder.png';
                                                if (row.identifying_image !== null) {
                                                    image_url = __WEB_MEDIA_ENGINE_URL__+JSON.parse(row.identifying_image)[0];
                                                }
                                                var date = formatDateRange(row.time_frame, page_globals.WEB_CURRENT_LANG_CODE);

                                                return `
                                                    <div class="swiper-slide">
                                                        <div class="card is-flex is-flex-direction-column full-link">
                                                            <div class="pt-5 pb-5 px-6 flow">
                                                                <h3 class="is-size-3 has-text-weight-semibold">
                                                                    <a href="${url}" target="_blank">${row.title}</a>
                                                                </h3>
                                                                ${(date)?
                                                                `<p class="has-text-weight-medium">${date}</p>`
                                                                :''}
                                                                <p class="more-link">${tstring.home_activities_more}</p>
                                                            </div>
                                                            ${(row.type)?
                                                            `<p class="has-text-weight-medium mb-3">
                                                                <a href="/actividades/?type=${row.type}" class="link-dn is-relative">${row.type}</a>
                                                            </p>`
                                                            :''}
                                                            <img loading="lazy" src="${image_url}" alt="">
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')
                                        }
                                    </div>
                                    <div class="swiper--activitats-${year}__btns">
                                        <div class="swiper-button-prev"></div>
                                        <div class="swiper-button-next"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                children_container.removeChild(children_container.lastChild);
                appendTemplate(children_container, htmlTemplate(html));
                let initializedYears = new Set();
                let accordionInstance = new TenUp.Accordion('.accordion', {
                    onOpen: function({link}) {
                        const year = link.textContent;
                        if (!initializedYears.has(year)) {
                            requestAnimationFrame(() => {
                                swiperActividadesAnual(year);
                            });
                        }
                        initializedYears.add(year);
                    }
                });
            });
        });
    },


    bloque_actividades_actuales: function(){
        var content = htmlTemplate(`
        <div class="children_container swiper-container is-relative">
            <div class="swiper swiper--actividades-actuales">
                <div class="swiper-wrapper">
                </div>
            </div>
            <div class="swiper--actividades-actuales__btns">
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
        `);

        var children_container = content[0].querySelector('.children_container .swiper-wrapper');

        api.getActividadesActuales().then(function(results){
            var content = htmlTemplate(`
                ${results.map(function(row){
                    const url = page_globals.__WEB_ROOT_WEB__ + '/' + row.tpl + '/' + row.section_id;
                    var image_url = '/assets/img/placeholder.png';
                    if (row.identifying_image !== null) {
                        image_url = __WEB_MEDIA_ENGINE_URL__+JSON.parse(row.identifying_image)[0];
                    }
                    var date = formatDateRange(row.time_frame, page_globals.WEB_CURRENT_LANG_CODE);

                    return `
                    <div class="swiper-slide">
                        <div class="card is-flex is-flex-direction-column full-link">
                            <div class="pt-5 pb-5 px-6 flow">
                                <h3 class="is-size-4">
                                    <a href="${url}" target="_blank">${row.title}</a>
                                </h3>
                                ${(date)?
                                `<p class="has-text-weight-medium">${date}</p>`
                                :''}
                            </div>
                            ${(row.type)?
                            `<p class="has-text-weight-medium mb-3">
                                <a href="/actividades/?type=${row.type}" class="link-dn is-relative">${row.type}</a>
                            </p>`
                            :''}
                            <img loading="lazy" src="${image_url}" alt="">
                        </div>
                    </div>
                    `;
                }).join('')}
            `);
            appendTemplate(children_container, content);
            swiperActividadesActuales();
        });
        return content;
    },


    bloque_catalogo_default: function(self){
        const data = self.loaded_items;

        var content = htmlTemplate(`
        <div>
            <div class="default_objects mt-8 flow--xl">
            </div>
            <div class="default_pictures mt-8 flow--xl">
            </div>
            <div class="default_inmovables mt-8 flow--xl">
            </div>
            <div class="default_documents mt-8 flow--xl">
            </div>
        </div>
        `);

        var children_container_objects = content[0].querySelector('div.default_objects');
        var children_container_pictures = content[0].querySelector('div.default_pictures');
        var children_container_inmovables = content[0].querySelector('div.default_inmovables');
        var children_container_documents = content[0].querySelector('div.default_documents');

        function load_items(type) {
            let title;
            let apiCall;
            let container;
            switch(type) {
                case 'objects':
                    title = tstring.collection_objects_default;
                    apiCall = api.getObjectsDefault;
                    container = children_container_objects;
                    break;
                case 'pictures':
                    title = tstring.collection_pictures_default;
                    apiCall = api.getPicturesDefault;
                    container = children_container_pictures;
                    break;
                case 'inmovables':
                    title = tstring.collection_inmovables_default;
                    apiCall = api.getInmovablesDefault;
                    container = children_container_inmovables;
                    break;
                case 'documents':
                    title = tstring.collection_documents_default;
                    apiCall = api.getDocumentsDefault;
                    container = children_container_documents;
                    break;
                default:
                    return;
            }
            // Si no hi ha cap element carregat, es creen els elements HTML de la galeria i botó de carregar més
            if (data[type].loaded === 0) {
                const new_gallery = htmlTemplate(`
                    <div class="is-flex is-justify-content-space-between is-align-items-center gap-4 mb-5">
                        <h2>${title}</h2>
                        <p class="result-count"></p>
                    </div>
                    <ul class="galeria galeria--242x242 link-dn"></ul>
                    <div class="has-text-centered mt-6">
                        <button type="button" class="button button--icon button--carrega" id="button_load_more_${type}">${tstring.collection_see_more}</button>
                    </div>
                `);
                appendTemplate(container, new_gallery);
                data[type].resultCount = container.querySelector('.result-count');

                // Afegim l'event listener al botó de carregar més
                container.querySelector(`#button_load_more_${type}`).addEventListener('click', function(){
                    if (data[type].loaded < data[type].total) {
                        load_items(type);
                    }
                });
            }


            var gallery_children = container.querySelector('.galeria');

            // Crida a la api per carregar més elements
            apiCall(data[type].loaded).then(function({data: results, total}){
                if (!results || results.length == 0) {
                    return;
                }
                // Guardem els resultats a l'objecte data
                data[type].results = data[type].results.concat(results);
                data[type].total = total;
                data[type].loaded += results.length;
                data[type].resultCount.innerHTML = `${total ? total : 0} ${(tstring.entries_found).toLowerCase()}`;

                // Si ja s'han carregat tots els elements, es treu el botó de carregar més
                if (data[type].loaded >= data[type].total) {
                    container.querySelector(`#button_load_more_${type}`).remove();
                }

                // Es crea el contingut HTML de la galeria
                var content = htmlTemplate(`
                    ${data[type].results.map(function(row){
                        const url = page_globals.__WEB_ROOT_WEB__ + '/' + row.tpl + '/' + row.section_id;
                        var image_url = '/assets/img/placeholder.png';
                        if (row.imagenes_identificativas.length > 0) {
                            image_url = __WEB_MEDIA_ENGINE_URL__+row.imagenes_identificativas[0].image;
                        }
                        return `
                        <li class="${row.tpl}">
                            <a href="${url}" target="_blank">
                                <figure>
                                    <img loading="lazy" src="${image_url}" alt="">
                                    ${(row.titulo)?`
                                    <figcaption>${row.titulo}</figcaption>
                                    `:''}
                                </figure>
                            </a>
                        </li>`;
                    }).join('')}
                `);

                // Esborrem el contingut anterior de la galeria i afegim el nou contingut
                gallery_children.innerHTML = '';
                appendTemplate(gallery_children, content);
            });
        }
        load_items('objects');
        load_items('pictures');
        load_items('immovables');
        load_items('documents');

        return content;
    },



/*
    Últimes publicacions del Museu
    Galeria de Serie de Trabajos Varios
    Galeria de Revista APL
    Galeria de Labor del SIP
    Galeria de Catálogos
    Galeria de Publicaciones Diverses
    Galeria Didáctica
    Galeria de Dodia
*/

    bloque_publicaciones_default: function(){
        var contentBase = htmlTemplate(`<div>
            <div class="default_last mt-8 flow--xl">
                <h2>${tstring.documents_default_last}</h2>
                <div class="swiper-container is-relative">
                    <div class="swiper swiper--publicacions swiper--publications-ultimes">
                        <div class="swiper-wrapper link-dn">
                        </div>
                    </div>
                    <div class="swiper--publicacions__btns swiper--publications-ultimes__btns">
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>
                </div>
            </div>
        </div>`);
        var children_container = contentBase[0].querySelector('.swiper-container .swiper-wrapper');

        api.getPublicacionesDestacados().then(function(results){
            var content = htmlTemplate(`
                ${results.map(function(row){
                    const url = page_globals.__WEB_ROOT_WEB__ + '/' + row.tpl + '/' + row.section_id;
                    var info = [];
                    if (row.autor) {
                        info.push(row.autor);
                    }
                    if (row.fecha_publicacion) {
                        info.push(row.fecha_publicacion);
                    }
                    var image_url = '/assets/img/placeholder.png';
                    if (row.pdf !== null) {
                        image_url = __WEB_MEDIA_ENGINE_URL__+imgPdf(row.pdf);
                    }

                    return `
                    <div class="swiper-slide">
                        <div class="is-flex is-flex-direction-column full-link gap-2">
                            <h3 class="is-size-6">
                                <a href="${url}" target="_blank">${row.titulo}</a>
                            </h3>
                            <div class="pubs-list__pict is-flex is-flex-direction-column is-justify-content-center is-align-items-center flex-order mb-4">
                                <img loading="lazy" src="${image_url}" alt="">
                            </div>
                            ${(info.length > 0)?`
                            <p class="is-size-7">
                                ${info.join('<br>')}
                            </p>
                        </div>
                        `:''}
                    </div>
                    `;
                }).join('')}
            `);
            appendTemplate(children_container, content);
            swiperPublications('ultimes');
        });
        return contentBase;
    },

    visitaYacimiento: function(info){
        var logo_url = null;
        if (info.identifying_image !== null && info.identifying_image.length > 0) {
            logo_url = __WEB_MEDIA_ENGINE_URL__+JSON.parse(info.identifying_image)[0];
            logo_url = logo_url.replace('.jpg', '.png');
        }
        var image_url = null;
        if (info.images !== null && info.images.length > 0) {
            image_url = __WEB_MEDIA_ENGINE_URL__+JSON.parse(info.images)[0];
        }
        return htmlTemplate(`
            <h2 class="is-flex is-align-items-center gap-2 mb-7 has-text-black">${info.title}</h2>
                <!-- block-text-img-dreta-fons-negre -->
                <div class="block-text-img-dreta-fons-negre">
                    <div class="block-dedalo columns is-widescreen">
                        <div class="column is-5-widescreen">
                            <div class="has-background-black h-100 has-text-white flow--l p-8">
                                ${(logo_url)?`
                                <img src="${logo_url}" width="157" height="78">
                                `:''}
                                ${(info.summary)?`
                                ${common.convertText(info.summary)}
                                `:''}
                            </div>
                        </div>
                        ${(image_url)?`
                        <div class="column">
                            <img loading="lazy" src="${image_url}" alt="" class="is-block">
                        </div>
                        `:''}
                    </div>
                </div>
                ${(info.description)?`
                <div class="block-dedalo is-variable is-8 is-multiline flow text-columns-2">
                    ${common.convertText(info.description)}
                </div>
                `:''}
                ${(info.children_data.length > 0)?`
                <h2 class="is-flex is-align-items-center gap-2 mb-7 has-text-black">${tstring.route_sites}</h2>
                <div class="tabs-2">
                    <div class="tab-control">
                        <ul class="tab-list" role="tablist">
                        ${info.children_data.map(function(elem){
                            return `<li class="tab-item">
                                <button role="tab" aria-controls="route-tab-${elem.section_id}">${elem.title}</button>
                            </li>`;
                        }).join('')}
                        </ul>
                    </div>
                    <div class="tab-group">

                    ${info.children_data.map(function(elem){
                        return `
                        <div class="tab-content" id="route-tab-${elem.section_id}" role="tabpanel">
                            <div class="block-dedalo columns is-variable is-8 is-multiline">
                                <div class="column is-half-tablet">
                                    <div class="block-titol-text flow">
                                        <h3>${elem.title}</h3>
                                        ${(elem.summary)?`
                                        <h4>${elem.summary}</h4>
                                        `:''}
                                        ${(elem.description)?`
                                        ${common.convertText(elem.description)}
                                        `:''}
                                    </div>
                                </div>
                                <div class="column is-half-tablet"></div>
                            </div>
                            ${(elem.children_data.length > 0)?`
                            <div class="has-background-grey-light pt-7">
                                <div class="px-6">
                                    <ul class="columns is-multiline is-variable is-7">
                                    ${elem.children_data.map(function(site){
                                        //console.log(site);
                                        var image_url = null;
                                        if (site.identifying_image !== null && site.identifying_image.length > 0) {
                                            image_url = __WEB_MEDIA_ENGINE_URL__+JSON.parse(site.identifying_image)[0];
                                        }
                                        if (site.images !== null && site.images.length > 0) {
                                            image_url = __WEB_MEDIA_ENGINE_URL__+JSON.parse(site.images)[0];
                                        }
                                        var documents = [];
                                        if (site.documents) {
                                            documents = JSON.parse(site.documents);
                                        }
                                        var documentsTitles = [];
                                        if (site.documents_title) {
                                            documentsTitles = JSON.parse(site.documents_title);
                                        }
                                        return `
                                        <li class="column is-half-tablet mb-8">
                                            <div class="columns is-desktop is-flex-direction-row-reverse">
                                                <div class="column is-flex is-flex-direction-column">
                                                    <div class="flow--2xs mb-5">
                                                        <h3 class="is-size-3 has-text-weight-semibold">${site.title}</h3>
                                                        ${(elem.place)?`
                                                        <p class="is-size-6 has-text-weight-medium">${site.place}</p>
                                                        `:''}
                                                    </div>
                                                    <ul class="actions-list mt-auto mb-4 has-text-weight-medium link-dn flow--xs is-size-5">
                                                        <li>
                                                            <div class="button-like" data-a11y-dialog-show="dialog-route-${site.section_id}" role="button" tabindex="0">
                                                                ${tstring.route_visit} ${site.title}
                                                            </div>
                                                        </li>
                                                        <!-- li>
                                                            <a href="/jaciments/fitxa-jaciment/">${tstring.route_more_info} ${site.title}</a>
                                                        </li -->
                                                        ${documents.map(function(document, index){
                                                        return `
                                                        <li>
                                                            <a href="${__WEB_MEDIA_ENGINE_URL__+document}">${documentsTitles[index]}</a>
                                                        </li>
                                                        `;
                                                        }).join('')}
                                                    </ul>
                                                </div>
                                                ${(image_url)?`
                                                <div class="column">
                                                    <img loading="lazy" src="${image_url}" width="380" height="250" alt="" class="is-block">
                                                </div>
                                                `:`
                                                <div class="column">
                                                    <img loading="lazy" src="/assets/img/placeholder2.png" width="380" height="250" alt="" class="is-block">
                                                </div>
                                                `}
                                            </div>
                                            <div class="dialog-container" data-a11y-dialog="dialog-route-${site.section_id}" aria-hidden="true" aria-labelledby="dialog-route-${site.section_id}-title">
                                                <div class="dialog-overlay" data-a11y-dialog-hide></div>
                                                <div class="dialog-content" role="document">
                                                    <button data-a11y-dialog-hide class="dialog-close" aria-label="${tstring.close}">
                                                        <svg width="44" height="44">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path d="M0 0h44v44H0z" />
                                                                <path stroke="#FFF" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" d="M33 11 11 33M11 11l22 22" />
                                                            </g>
                                                        </svg>
                                                    </button>
                                                    <div class="columns is-fullhd is-variable is-8">
                                                        ${(image_url)?`
                                                        <div class="column">
                                                            <img loading="lazy" src="${image_url}" alt="">
                                                        </div>
                                                        `:''}
                                                        <div class="column text-base flow--2xs">
                                                            <div class="flow--xs">
                                                                <h1 id="dialog-01-title">${site.title}</h1>
                                                                ${(elem.place)?`
                                                                <p class="is-size-3 has-text-weight-medium">${site.place}</p>
                                                                `:''}
                                                            </div>
                                                            <h2 class="is-flex is-align-items-center gap-2 mt-7">
                                                                <img src="/assets/img/ico-localitzacio-small.svg" alt="" width="20" height="20">
                                                                ${tstring.site_how_arrive}
                                                            </h2>
                                                            ${common.convertText(site.summary)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>`;
                                    }).join('')}
                                    </ul>
                                </div>
                            </div>
                            `:''}
                        </div>`;
                    }).join('')}
                    </div>
                `:''}
                </div>
        `);
    },

}
