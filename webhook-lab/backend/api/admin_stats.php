<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../classes/Response.php';
require_once __DIR__ . '/../classes/Analytics.php';

// Note: In a production environment, you should add a secret admin token 
// or basic auth to this endpoint. For now, it's open but hidden.

$analytics = new Analytics();
$stats = $analytics->getAdminStats();

Response::success($stats);
