<?php
// classes/Analytics.php
require_once __DIR__ . '/Database.php';

class Analytics {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function logEvent($playerId, $eventType, $missionIndex = null, $eventData = null) {
        $stmt = $this->db->prepare("INSERT INTO analytics_events (player_id, event_type, mission_index, event_data) VALUES (?, ?, ?, ?)");
        return $stmt->execute([
            $playerId, 
            $eventType, 
            $missionIndex, 
            $eventData ? json_encode($eventData) : null
        ]);
    }
    
    public function getAdminStats() {
        $stats = [];
        
        // Total players
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM players");
        $stats['total_engineers'] = $stmt->fetch()['total'];
        
        // Online players (active in last 5 minutes)
        $stmt = $this->db->query("SELECT COUNT(*) as online FROM players WHERE last_active_at >= NOW() - INTERVAL 5 MINUTE");
        $stats['online_engineers'] = $stmt->fetch()['online'];
        
        // Certified platform engineers
        $stmt = $this->db->query("SELECT COUNT(*) as certified FROM players WHERE has_completed_game = 1");
        $stats['certified_engineers'] = $stmt->fetch()['certified'];
        
        // Mission drop-off (how many players unlocked vs completed each mission)
        $stmt = $this->db->query("
            SELECT mission_index, 
                   SUM(CASE WHEN status IN ('unlocked', 'completed') THEN 1 ELSE 0 END) as started,
                   SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM mission_progress 
            GROUP BY mission_index 
            ORDER BY mission_index ASC
        ");
        $stats['mission_stats'] = $stmt->fetchAll();
        
        return $stats;
    }
}
