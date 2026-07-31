<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../classes/Response.php';
require_once __DIR__ . '/../classes/Player.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['engineer_id']) || !isset($input['player_token'])) {
    Response::error('Authentication required', 401);
}

$playerModel = new Player();
$player = $playerModel->authenticate($input['engineer_id'], $input['player_token']);

if (!$player) {
    Response::error('Invalid credentials', 401);
}

if ($playerModel->heartbeat($player['id'])) {
    Response::success(['message' => 'Heartbeat logged']);
} else {
    Response::error('Failed to log heartbeat', 500);
}
