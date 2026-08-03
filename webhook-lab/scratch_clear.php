<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
require 'backend/config/config.php';
require 'backend/classes/Database.php';

try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("DELETE FROM players");
    echo "Players table cleared successfully.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
