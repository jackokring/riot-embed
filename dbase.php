<?php
include('../wp-config.php');
//Now we have DB_NAME, DB_USER, DB_PASSWORD, DB_HOST for making a show!

define('DB_PREFIX', $table_prefix . $table_prefix);
//This should avoid some problems, but not all!

/* The install used for development uses /testy/dbase.php as a default ModRewrite
	to this script. As this is a proxy [P] to /var/www/html/dbase.php then
	../wp-config.php is one up in /var/www. Make sure you correct the first
	include line for this. IMPORTANT!! */
	
header('Content-Type: application/json');
//set a general javascript return type. This can auto encapsulate JSON.
//Actual javascripts are not loaded from the dynamic pages ...


?>
