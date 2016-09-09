<?php
include('../wp-config.php');
//Now we have DB_NAME, DB_USER, DB_PASSWORD, DB_HOST for making a show!

define('DB_PREFIX', 're-');
//This should avoid some problems!

/* The install used for development uses /testy/dbase.php as a default ModRewrite
	to this script. As this is a proxy [P] to /var/www/html/dbase.php then
	../wp-config.php is one up in /var/www. Make sure you correct the first
	include line for this. IMPORTANT!! */
	
header('Content-Type: application/json');
//set a general javascript return type. This can auto encapsulate JSON.
//Actual javascripts are not loaded from the dynamic pages ...

function input() {
	$i = file_get_contents("php://input");
	return json_decode($i);
	//ok
}

function cacheHash() {
	return intval($_SERVER['QUERY_STRING']);//super global
}

// Create connection
$conn = mysqli_connect($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);

// Check connection
if (!$conn) {
    die('"Database conncetion error: ' . mysqli_connect_error() . '"');//as JSON
}

//========================================
// OK the DB is up
//========================================





?>
