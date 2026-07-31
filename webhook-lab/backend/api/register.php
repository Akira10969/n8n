<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../classes/Response.php';
require_once __DIR__ . '/../classes/Player.php';

$playerModel = new Player();
$newPlayer = $playerModel->register();

if ($newPlayer) {
    Response::success($newPlayer);
} else {
    Response::error('Failed to register new player', 500);
}
