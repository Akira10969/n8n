<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../classes/Response.php';
require_once __DIR__ . '/../classes/Player.php';
require_once __DIR__ . '/../classes/Analytics.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['engineer_id']) || !isset($input['player_token'])) {
    Response::error('Authentication required', 401);
}

$playerModel = new Player();
$player = $playerModel->authenticate($input['engineer_id'], $input['player_token']);

if (!$player) {
    Response::error('Invalid credentials', 401);
}

if (!isset($input['event_type'])) {
    Response::error('Event type required', 400);
}

$analytics = new Analytics();
$success = $analytics->logEvent(
    $player['id'], 
    $input['event_type'], 
    $input['mission_index'] ?? null, 
    $input['event_data'] ?? null
);

if ($success) {
    Response::success(['message' => 'Event logged']);
} else {
    Response::error('Failed to log event', 500);
}
