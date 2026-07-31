<?php
// config.php

// CORS Headers for XAMPP / Local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Database Credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'mei_cloud_os');
define('DB_USER', 'root'); // XAMPP default
define('DB_PASS', '');     // XAMPP default

// App constants
define('GAME_VERSION', '1.0.0');
