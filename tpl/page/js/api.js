"use strict";

var api = {

    activitadesCategorias: function() {
        return [
            4,//Actividad
            28,//Acto conmemorativo
            26,//Acto de homenaje
            15,//Conferencia
            10,//Comunicación
            30,//Ciclo de conferencias
            35,//Ciclo de cine
            34,//Concurso
            19,//Congreso
            29,//Curso
            32,//Feria
            18,//Jornadas
            17,//Jornadas en yacimentos
            13,//Día de los Museos/Noche de los Museos
            16,//Presentación
            14,//Proyección
            31,//Seminario/Reunión
            33,//Mesa redonda
            21,//Taller de formación/ Taller de trabajo
            22,//Bookcrossing
        ];
    },

    categoryToSql: function(cats) {
        if (cats.length == 0) {
            return '';
        }
        var filter = cats.map(function(elem){
            return "type_data like '%\\\""+elem+"\\\"%'";
        });
        return '('+filter.join(' or ')+')';
    },


    getPublicacionesDestacados: function(serie = null) {
        var options = {
            table: 'publications',
            //sql_filter: 'imagen_identificativa is not null',
            sql_filter: `pertenencia_data like 1 AND destacado = 1`,
            limit: 6,
            order: 'fecha_publicacion desc',
            //ar_fields: '*',
            parse: page.parse_list_data,
            //resolve_portals_custom: '{"imagen_identificativa": "image"}'
        };
        if (serie !== null) {
            //options.sql_filter = options.sql_filter+' and serie_data = \'["'+serie+'"]\''
            options.sql_filter = 'serie_data = \'["'+serie+'"]\' AND destacado = 1'
        }
        return page.get_records(options);
    },

    getPublicacionesSeries: function() {
        //Galeria de Serie de Trabajos Varios -> 3
        //Galeria de Revista APL -> 9
        //Galeria de Labor del SIP -> 4
        //Galeria de Catálogos -> 8
        //Galeria de Publicaciones Diverses -> 7
        //Galeria Didáctica -> 6
        //Galeria de Dodia -> 13
        var options = {
            table: 'publications',
            ar_fields: "serie,serie_data",
            sql_filter: 'serie_data is not null and serie_data in (\'["3"]\', \'["9"]\', \'["4"]\', \'["8"]\', \'["7"]\', \'["6"]\', \'["13"]\')',
            limit: 0,
            order: 'fecha_publicacion ASC',
            //ar_fields: '*',
            group: 'serie_data',
            parse: this.parseSeries,
        };
        return page.get_records(options);
    },

    parseSeries: function(rows) {
        var result = rows.map(value => {
            return {
                'name': value.serie,
                'id': JSON.parse(value.serie_data)[0]
            }
        });
        return result;
    },


    getActividadesActuales: function() {
        var options = {
            table: 'activities',
            sql_filter: "time_frame is not null and NOW() BETWEEN STR_TO_DATE(SUBSTRING_INDEX(time_frame, ',', 1), '%Y-%m-%d %H:%i:%s') AND STR_TO_DATE(SUBSTRING_INDEX(time_frame, ',', -1), '%Y-%m-%d %H:%i:%s') and "+this.categoryToSql(this.activitadesCategorias()),
            //limit: 6,
            order: 'time_frame asc',
            ar_fields: '*',
            parse: page.parse_list_data,
            //resolve_portals_custom: '{"image": "image"}'
        };
        return page.get_records(options);
    },


    getActivitiesByYear: function (year) {
        var options = {
            table: 'activities',
            order: 'time_frame desc',
            ar_fields: 'date_start_year,section_id,identifying_image,time_frame,title,type',
            sql_filter: `date_start_year = ${year}`,
            parse: page.parse_list_data
        };
        return page.get_records(options);
    },

    getActivitiesYears: function() {
        var options = {
            table: 'activities',
            order: 'date_start_year desc',
            ar_fields: 'date_start_year',
            group: 'date_start_year',
            sql_filter: 'date_start_year IS NOT NULL',
            parse: page.parse_list_data
        }
        return page.get_records(options);
    },

    getOldestDate: function() {
        var options = {
            table: "objects,pictures,immovables,documents_catalog",
            ar_fields: "datacion_ini",
            sql_filter: "datacion_ini IS NOT NULL",
            order: "datacion_ini ASC",
            limit: 1
        }
        return page.get_records(options);
    },

    getNewestDate: function() {
        var options = {
            table: "objects,pictures,immovables,documents_catalog",
            ar_fields: "datacion_fin",
            sql_filter: "datacion_fin IS NOT NULL",
            order: "datacion_fin DESC",
            limit: 1
        }
        return page.get_records(options);
    },

    getRangeDates: function() {
        return Promise.all([
            this.getOldestDate(),
            this.getNewestDate()
        ]).then(function(results) {
            var oldest = results[0][0].datacion_ini;
            var newest = results[1][0].datacion_fin;
            return [oldest, newest];
        });
    },

    getObjectsDefault: function(offset = 0) {
        var options = {
            //table: 'objects,pictures,immovables,documents_catalog',
            table: 'objects',
            sql_filter: 'imagenes_identificativas is not null and destacado is not null',
            limit: 12,
            order: null,
            ar_fields: 'section_tipo,section_id,imagenes_identificativas,titulo',
            parse: page.parse_list_data,
            resolve_portals_custom: '{"imagenes_identificativas": "image"}',
            count: true,
            get_count: true,
            offset: offset,
        };
        return page.get_records(options);
    },
    getPicturesDefault: function() {
        var options = {
            //table: 'objects,pictures,immovables,documents_catalog',
            table: 'pictures',
            sql_filter: 'imagenes_identificativas is not null and destacado is not null',
            limit: 12,
            order: null,
            ar_fields: 'section_tipo,section_id,imagenes_identificativas,titulo',
            parse: page.parse_list_data,
            resolve_portals_custom: '{"imagenes_identificativas": "image"}',
            count: true,
            get_count: true,
        };
        return page.get_records(options);
    },
    getInmovablesDefault: function() {
        var options = {
            //table: 'objects,pictures,immovables,documents_catalog',
            table: 'immovables',
            sql_filter: 'imagenes_identificativas is not null and destacado is not null',
            limit: 12,
            order: null,
            ar_fields: 'section_tipo,section_id,imagenes_identificativas,titulo',
            parse: page.parse_list_data,
            resolve_portals_custom: '{"imagenes_identificativas": "image"}',
            count: true,
            get_count: true,
        };
        return page.get_records(options);
    },
    getDocumentsDefault: function() {
        var options = {
            //table: 'objects,pictures,immovables,documents_catalog',
            table: 'documents_catalog',
            sql_filter: 'imagenes_identificativas is not null and destacado is not null',
            limit: 12,
            order: null,
            ar_fields: 'section_tipo,section_id,imagenes_identificativas,titulo',
            parse: page.parse_list_data,
            resolve_portals_custom: '{"imagenes_identificativas": "image"}',
            count: true,
            get_count: true,
        };
        return page.get_records(options);
    },

    getRelatedElements: function(table, relation, relationId, offset = 0) {
        var options = {
            table: table,
            sql_filter: `${relation} LIKE '%\"${relationId}\"%' and imagenes_identificativas is not null`,
            parse: page.parse_list_data,
            resolve_portals_custom: '{"imagenes_identificativas": "image"}',
            limit: 50,
            order: 'datacion_ini ASC',
            ar_fields: 'section_id,titulo,periodo,imagenes_identificativas',
            count: true,
            offset: offset,
            get_count: true,
        }

        return page.get_records(options);
    },

    getPeriodYears: function(ids) {
        var options = {
            table: 'ts_chronological',
            ar_fields: 'term, time, section_id',
            section_id: ids.join(','),
        };

        return page.get_records(options);
    },


    getExcavaciones: function(excavacions) {
        var options = {
            table: 'excavations',
            section_id: excavacions.join(','),
            //sql_filter: "time_frame is not null and NOW() BETWEEN STR_TO_DATE(SUBSTRING_INDEX(time_frame, ',', 1), '%Y-%m-%d %H:%i:%s') AND STR_TO_DATE(SUBSTRING_INDEX(time_frame, ',', -1), '%Y-%m-%d %H:%i:%s')",
            //limit: 3,
            order: 'section_id asc',
            ar_fields: '*',
            //parse: page.parse_list_data,
            resolve_portals_custom: '{"identifying_image_data": "image"}'
        };
        return page.get_records(options);
    },

    getVisitaYacimientoCatalog: function(title) {
        var options = {
            table: 'ts_route',
            sql_filter: 'title = "'+title+'"',
            ar_fields: 'section_id,summary',
            order: 'section_id asc',
            parse: function(info){return info}
        };
        return page.get_records(options).then(function(results){
            return results[0]
        });
    },
};
