<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../classes/Response.php';
require_once __DIR__ . '/../classes/Player.php';
require_once __DIR__ . '/../classes/Database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['engineer_id']) || !isset($input['player_token'])) {
    Response::error('Authentication required', 401);
}

$playerModel = new Player();
$player = $playerModel->authenticate($input['engineer_id'], $input['player_token']);

if (!$player) {
    Response::error('Invalid credentials', 401);
}

$db = Database::getInstance();

try {
    $db->beginTransaction();

    // 1. Update core player stats
    if (isset($input['xp'])) {
        $xp = (int)$input['xp'];
        $rank = $input['rank'] ?? 'Junior DevOps';
        $hearts = (int)($input['hearts'] ?? 5);
        $hasCompleted = (bool)($input['hasCompletedGame'] ?? false);
        
        $playerModel->updateProgress($player['id'], $xp, $rank, $hearts, $hasCompleted);
    }

    // 2. Sync unlocked missions
    if (isset($input['highestUnlockedIndex'])) {
        $highest = (int)$input['highestUnlockedIndex'];
        for ($i = 0; $i <= $highest; $i++) {
            $stmt = $db->prepare("INSERT IGNORE INTO mission_progress (player_id, mission_index, status) VALUES (?, ?, 'unlocked')");
            $stmt->execute([$player['id'], $i]);
        }
    }

    // 3. Sync completed missions
    if (isset($input['completedMissions']) && is_array($input['completedMissions'])) {
        foreach ($input['completedMissions'] as $missionIndex) {
            $stmt = $db->prepare("INSERT INTO mission_progress (player_id, mission_index, status, completed_at) VALUES (?, ?, 'completed', CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE status = 'completed', completed_at = IFNULL(completed_at, CURRENT_TIMESTAMP)");
            $stmt->execute([$player['id'], (int)$missionIndex]);
        }
    }

    // 4. Sync achievements
    if (isset($input['achievements']) && is_array($input['achievements'])) {
        foreach ($input['achievements'] as $achId) {
            $stmt = $db->prepare("INSERT IGNORE INTO player_achievements (player_id, achievement_id) VALUES (?, ?)");
            $stmt->execute([$player['id'], $achId]);
        }
    }

    $db->commit();
    Response::success(['message' => 'Progress synced successfully']);

} catch (Exception $e) {
    $db->rollBack();
    error_log("Sync Error: " . $e->getMessage());
    Response::error('Failed to sync progress', 500);
}
