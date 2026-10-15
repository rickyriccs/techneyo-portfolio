<?php
/**
 * Techneyo Database & Environment Configuration
 * 
 * Supports:
 * 1. Server Environment Variables (getenv / $_ENV / $_SERVER)
 * 2. .env file in root or api directory
 * 3. Default fallback values for Hostinger MySQL
 */

// Prevent direct browser inspection of raw config
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    header('HTTP/1.1 403 Forbidden');
    exit('Access denied');
}

// Function to load .env file if present
function load_env_file($path) {
    if (!file_exists($path) || !is_readable($path)) {
        return false;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            // Remove quotes if present
            if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
                (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
                $value = substr($value, 1, -1);
            }
            if (!isset($_SERVER[$name]) && !isset($_ENV[$name])) {
                putenv("$name=$value");
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
    return true;
}

// Attempt to load .env or .env.local from current dir, parent, or document root
$docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
$possible_env_paths = [
    __DIR__ . '/.env',
    __DIR__ . '/.env.local',
    __DIR__ . '/../.env',
    __DIR__ . '/../.env.local',
    __DIR__ . '/../../.env',
    __DIR__ . '/../../.env.local',
    $docRoot ? $docRoot . '/.env' : null,
    $docRoot ? $docRoot . '/.env.local' : null,
    $docRoot ? dirname($docRoot) . '/.env' : null,
];
foreach ($possible_env_paths as $p) {
    if ($p && file_exists($p)) {
        load_env_file($p);
    }
}

function env_val($key, $default = '') {
    $val = getenv($key);
    if ($val !== false && $val !== '') return $val;
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') return $_ENV[$key];
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') return $_SERVER[$key];
    return $default;
}

// Configuration values (supports both MYSQL_* and DB_* naming conventions)
$DB_HOST = env_val('MYSQL_HOST', env_val('DB_HOST', 'localhost'));
$DB_PORT = env_val('MYSQL_PORT', env_val('DB_PORT', '3306'));
$DB_NAME = env_val('MYSQL_DATABASE', env_val('MYSQL_DB', env_val('DB_NAME', env_val('DB_DATABASE', 'techneyo_portfolio'))));
$DB_USER = env_val('MYSQL_USER', env_val('DB_USER', env_val('MYSQL_USERNAME', env_val('DB_USERNAME', 'root'))));
$DB_PASS = env_val('MYSQL_PASSWORD', env_val('DB_PASSWORD', env_val('MYSQL_PASS', env_val('DB_PASS', 'Ns@ram01'))));

$JWT_SECRET = env_val('JWT_SECRET', 'techneyo_jwt_super_secret_key_2026_production');
$ADMIN_EMAIL = env_val('ADMIN_EMAIL', 'admin@techneyo.com');
$ADMIN_PASSWORD = env_val('ADMIN_PASSWORD', 'Ns@ram01');

/**
 * Returns a PDO database connection instance.
 */
function get_db_connection() {
    global $DB_HOST, $DB_PORT, $DB_NAME, $DB_USER, $DB_PASS;
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'error' => 'Database connection failed. Please check MySQL credentials in Hostinger / .env',
            'message' => $e->getMessage(),
            'database' => $DB_NAME,
            'host' => $DB_HOST
        ]);
        exit;
    }
}
