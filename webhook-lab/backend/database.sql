-- MEI_Cloud_OS Database Schema
-- Compatible with cPanel phpMyAdmin (select your database first before importing)

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    engineer_id VARCHAR(20) NOT NULL UNIQUE,
    player_token VARCHAR(64) NOT NULL,
    name VARCHAR(50) DEFAULT NULL,
    avatar VARCHAR(50) DEFAULT NULL,
    xp INT DEFAULT 0,
    rank_name VARCHAR(50) DEFAULT 'Junior DevOps',
    hearts INT DEFAULT 5,
    game_version VARCHAR(20) DEFAULT '1.0.0',
    has_completed_game BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mission_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    mission_index INT NOT NULL,
    status ENUM('locked', 'unlocked', 'completed') DEFAULT 'locked',
    completed_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE KEY unique_player_mission (player_id, mission_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS player_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    achievement_id VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE KEY unique_player_achievement (player_id, achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS analytics_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    mission_index INT DEFAULT NULL,
    event_data JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
