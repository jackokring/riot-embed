<?php
//================================================
// DROP THIS FILE IN YOUR WORDPRESS FOLDER
//================================================
include('wp-config.php');
//Now we have DB_NAME, DB_USER, DB_PASSWORD, DB_HOST for making a show!

define('DB_PREFIX', 're-');
//This should avoid some problems!
	
header('Content-Type: application/json');
//set a general javascript return type. This can auto encapsulate JSON.
//Actual javascripts are not loaded from the dynamic pages ...

function input() {
	$i = file_get_contents("php://input");
	return json_decode($i);
	//ok
}

function session() {
	$h = md5($ip . DB_NAME . DB_HOST);
	$c = $_COOKIE['session'];
	$ip = $_SERVER['REMOTE_ADDR'];
	if(!isset($c)) {
		$c = $h;
		setcookie('session', $c);
		logout();
	} else {
		if($c != $h) {
			unset($_COOKIE['session']);
			session();
		}
	}
	return $c;
}

function cacheHash() {
	return intval($_SERVER['QUERY_STRING']);//super global
}

// Create connection
$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

function chuck(str) {
	var object;
	object['error'] = str; 
	die(json_encode(object));
}

// Check connection
if (!$conn) {
	chuck('Database conncetion error: ' . mysqli_connect_error());//as JSON
}

//========================================
// OK the DB is up
//========================================



function logout() {
	
}

?>
