<?php
// classes/Response.php

class Response {
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }

    public static function error($message, $statusCode = 400) {
        self::json(['success' => false, 'error' => $message], $statusCode);
    }
    
    public static function success($data = []) {
        $response = ['success' => true];
        if (!empty($data)) {
            $response['data'] = $data;
        }
        self::json($response, 200);
    }
}
