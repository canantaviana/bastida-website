<?php
# config Dédalo API client (web_app)



// used to build absolute calls to elements
	define('__WEB_BASE_PATH__', dirname(dirname(dirname(__FILE__))));



// source data api
$environment = 'prod'; // pre , prod



// custom development working vars (api client)
	define('WEB_ENTITY' ,'mupreva');
	define('WEB_ENTITY_LABEL' ,'Bastida de les Alcusses');

// db . force use this db instead of default (usefull for multiple pubolications)
	define('WEB_DB' ,'web_bastida_alcusses');

// site config

	// __web_base_url__ . absolute url base to target web. Used to build absolute calls to elements
		define('__WEB_BASE_URL__', ($environment==='prod')
			? 'https://dedalo.mupreva.org/'
			: 'https://pre-dedalo.mupreva.org/');

	// media base url
		define('__WEB_MEDIA_BASE_URL__', 'http://www.mupreva.org');

	// __web_root_web__
		//$parts = explode('/',$_SERVER['REQUEST_URI']);
		//$base  = '/'.$parts[1];
		//define('__WEB_ROOT_WEB__', $base);
		define('__WEB_ROOT_WEB__', '');

	// web_app_dir
		define('WEB_APP_DIR', 'web_app');

	// web_dispatch_dir
		define('WEB_DISPATCH_DIR', 'web');

	// __web_template_web_
		define('__WEB_TEMPLATE_WEB__' , __WEB_ROOT_WEB__  .'/tpl' );
		define('__WEB_TEMPLATE_PATH__', __WEB_BASE_PATH__ .'/tpl');

		define(
			'__WEB_MEDIA_ENGINE_URL__',
			($environment === 'prod')
				? 'https://dedalo.mupreva.org'
				: 'https://pre-dedalo.mupreva.org'
		);

	// version
		include(__WEB_TEMPLATE_PATH__ . '/version.inc');



// api config

	// json_trigger_url data source url
		define('JSON_TRIGGER_URL', ($environment==='prod')
			? 'https://dedalo.mupreva.org/dedalo6/publication/server_api/v1/json/'
			: 'https://pre-dedalo.mupreva.org/dedalo6-pre/publication/server_api/v1/json/');

	// json_web_data colector. PHP version http request manager (via CURL)
		include(__WEB_BASE_PATH__ .'/'. WEB_APP_DIR . '/api/class.json_web_data.php');

	// api_web_user_code
		# Verification user code (must be identical in config of client and server)
		define('API_WEB_USER_CODE', 'lsi8wM5s$4KueñwkoPwgs');

	// common core functions
		include(__WEB_BASE_PATH__ .'/'. WEB_APP_DIR . '/common/class.page.php');
		include(__WEB_BASE_PATH__ .'/'. WEB_APP_DIR . '/common/class.common.php');
		include(__WEB_BASE_PATH__ .'/'. WEB_APP_DIR . '/common/class.lang.php');

	// session
		if (session_status() !== PHP_SESSION_ACTIVE) {
			session_name('web_'.WEB_ENTITY);
			session_start();
		}

	// lang cascade set
		define('WEB_DEFAULT_LANG_CODE', 'lg-vlca');
		if (isset($_GET['lang'])) {
			$lang = $_GET['lang'];
			$_SESSION['web']['lang'] = $lang;
		}elseif (isset($_SESSION['web']['lang'])) {
			$lang = $_SESSION['web']['lang'];
		}else{
			$lang = WEB_DEFAULT_LANG_CODE;
		}
		if (strpos($lang, 'lg-')===false) {
			$lang = lang2iso3($lang);
		}

	// web_current_lang_code
		define('WEB_CURRENT_LANG_CODE', $lang);

	// web_lang_base_path
		define('WEB_LANG_BASE_PATH', __WEB_TEMPLATE_PATH__ . '/lang/');



// debug . Show / hide debug messages
	$SHOW_DEBUG = true;
	define('SHOW_DEBUG', $SHOW_DEBUG);



// web config
	define('WEB_MENU_TABLE', 		'ts_web_bastida');
	define('WEB_MENU_SECTION_TIPO', 'wwwbastida1');
	define('WEB_MENU_PARENT', 		'wwwbastida1_1');
	define('WEB_HOME_PATH', 		'web');

	define('WEB_AR_LANGS', json_encode([
		"lg-vlca" => "Valencià",
		"lg-spa"  => "Castellano",
		"lg-eng"  => "English"
	]));

	define('WEB_MAP_PROVIDER_URL', '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

	# Web template file json
	define('WEB_TEMPLATE_MAP', __WEB_BASE_PATH__ .'/config/template_maps/'.WEB_ENTITY);
	define('WEB_TEMPLATE_MAP_DEFAULT_SOURCE', 'db');

	# web_path_map . run name map for url's path like redirect 'mon' to 'catalogo'
	define('WEB_PATH_MAP',	[]);



// breadcrumb
	define('BUILD_BREADCRUMB', false);



// table to temple . Map table name to template name like 'generic_detail' for table 'actividades'
	define('TABLE_TO_TEMPLATE', [
		'actividades' => 'ficha_actividades',
		'excavaciones' => 'ficha_excavaciones',
		'catalogo' => 'ficha_catalogo',
		'yacimientos' => 'ficha_yacimientos',
		'contextos' => 'ficha_contextos',
		'espacios' => 'ficha_espacios',
		'tematicas' => 'ficha_tematicas',
		'publicaciones' => 'ficha_publicaciones',
		'publicaciones_externas' => 'ficha_publicaciones_externas',
		'galeria_digital' => 'ficha_galeria_digital',
		'galeria_ephemera' => 'ficha_galeria_ephemera',
		'galeria_video' => 'ficha_galeria_video',
		'galeria_audio' => 'ficha_galeria_audio',
		'immovables' => 'Pagina generica',
	]);



// fields map
	define('WEB_FIELDS_MAP', json_encode([
		'section_id' 	=> 'section_id',
		'term_id' 		=> 'term_id',
		'term'			=> 'term',
		'web_path'		=> 'web_path',
		'title'			=> 'title',
		'parent' 		=> 'parent',
		'childrens' 	=> 'childrens',
		'web_path' 		=> 'web_path',

		'template_name' => 'template_name',
		'entradilla' 	=> 'abstract',
		'cuerpo' 		=> 'body',
		'norder'		=> 'norder',
		'imagen'		=> 'image',
		'menu'          => 'menu',
		'other_images_resolved' => 'other_images_resolved',
		//'locatitzations'				=> 'immovables',
		//'direccion' 	=> 'direccion',
		//'telf' 			=> 'telf',
		//'email'			=> 'email'
		/*'actividades'			=> 'actividades',
		'excavaciones'			=> 'excavaciones',
		'catalogo'				=> 'catalogo',
		'yacimientos'			=> 'yacimientos',
		'contextos'				=> 'contextos',
		'espacios'				=> 'espacios',
		'temas'					=> 'temas',
		'publicaciones'			=> 'publicaciones',
		'publicaciones_externas'=> 'publicaciones_externas',
		'galeria_digital'		=> 'galeria_digital',
		'galeria_ephemera'		=> 'galeria_ephemera',
		'galeria_video'			=> 'galeria_video',
		'galeria_audio'			=> 'galeria_audio'*/
	]));



// suffix
	define('CSS_SUFFIX', '');
	define('JS_SUFFIX' , ''); // -min



// safe images url
	define('SAFE_IMAGES_URL', false);



// menu skip terms
	define('MENU_SKIP_TERMS', [1,6]);
