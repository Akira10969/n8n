<?php
// classes/Player.php
require_once __DIR__ . '/Database.php';

class Player {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function generateEngineerId() {
        // Generate e.g. MEI-ENG-7F8A2C
        $chars = '0123456789ABCDEF';
        $random = '';
        for ($i = 0; $i < 6; $i++) {
            $random .= $chars[rand(0, strlen($chars) - 1)];
        }
        return 'MEI-ENG-' . $random;
    }
    
    public function register() {
        $engineer_id = $this->generateEngineerId();
        
        // Ensure uniqueness
        while ($this->findByEngineerId($engineer_id)) {
            $engineer_id = $this->generateEngineerId();
        }
        
        $player_token = bin2hex(random_bytes(32));
        
        $stmt = $this->db->prepare("INSERT INTO players (engineer_id, player_token) VALUES (?, ?)");
        $stmt->execute([$engineer_id, $player_token]);
        
        return [
            'id' => $this->db->lastInsertId(),
            'engineer_id' => $engineer_id,
            'player_token' => $player_token
        ];
    }
    
    public function findByEngineerId($engineer_id) {
        $stmt = $this->db->prepare("SELECT * FROM players WHERE engineer_id = ?");
        $stmt->execute([$engineer_id]);
        return $stmt->fetch();
    }
    
    public function authenticate($engineer_id, $token) {
        $stmt = $this->db->prepare("SELECT * FROM players WHERE engineer_id = ? AND player_token = ?");
        $stmt->execute([$engineer_id, $token]);
        return $stmt->fetch();
    }
    
    public function updateProgress($id, $xp, $rank, $hearts, $hasCompleted) {
        $stmt = $this->db->prepare("UPDATE players SET xp = ?, rank_name = ?, hearts = ?, has_completed_game = ? WHERE id = ?");
        return $stmt->execute([$xp, $rank, $hearts, $hasCompleted ? 1 : 0, $id]);
    }
    
    public function heartbeat($id) {
        // Updates last_active_at implicitly via ON UPDATE CURRENT_TIMESTAMP if we update a column,
        // but it's better to explicitly set it to ensure it triggers even if data hasn't changed.
        $stmt = $this->db->prepare("UPDATE players SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
