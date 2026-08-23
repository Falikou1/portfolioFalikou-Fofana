<?php
/**
 * PHP Local API Bridge for XAMPP / Apache
 * Mirrors Vercel Serverless API endpoints for 100% offline local functionality.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../data/portfolio.json';
$defaultFile = __DIR__ . '/../data/default-portfolio.json';

// Initialize data file if not exists
if (!file_exists($dataFile) && file_exists($defaultFile)) {
    copy($defaultFile, $dataFile);
}

function getPortfolioData($dataFile, $defaultFile) {
    if (file_exists($dataFile)) {
        return json_decode(file_get_contents($dataFile), true);
    }
    if (file_exists($defaultFile)) {
        return json_decode(file_get_contents($defaultFile), true);
    }
    return [];
}

function savePortfolioData($dataFile, $data) {
    return file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function verifyToken($headers) {
    $auth = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
    $token = preg_replace('/^Bearer\s+/i', '', $auth);
    if (!$token) return false;
    $parts = explode('.', $token);
    if (count($parts) !== 2) return false;
    $payload = json_decode(base64_decode(strtr($parts[0], '-_', '+/')), true);
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < (time() * 1000)) {
        return false;
    }
    return $payload;
}

$route = isset($_GET['route']) ? $_GET['route'] : (isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : 'portfolio');
$method = $_SERVER['REQUEST_METHOD'];
$headers = getallheaders();
$body = json_decode(file_get_contents('php://input'), true);

// 1. AUTH ROUTE
if ($route === 'auth' || strpos($route, 'auth') !== false) {
    $action = isset($_GET['action']) ? $_GET['action'] : (isset($body['action']) ? $body['action'] : 'login');

    if ($method === 'POST' && $action === 'login') {
        $pwd = isset($body['password']) ? $body['password'] : '';
        if ($pwd === 'admin123' || $pwd === 'Falikou@2026!' || $pwd === 'admin') {
            $payload = [
                'user' => 'Falikou',
                'role' => 'admin',
                'exp' => (time() + 7 * 86400) * 1000,
                'nonce' => bin2hex(random_bytes(16))
            ];
            $str = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
            $sig = rtrim(strtr(base64_encode(hash_hmac('sha256', $str, 'falikou_portfolio_secret_key_jwt_secure_2026', true)), '+/', '-_'), '=');
            $token = $str . '.' . $sig;

            echo json_encode([
                'success' => true,
                'message' => 'Connexion réussie (XAMPP Local)',
                'token' => $token,
                'user' => ['name' => 'Falikou FOFANA', 'role' => 'admin']
            ]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Mot de passe administrateur incorrect.']);
            exit;
        }
    }

    if ($action === 'verify') {
        $session = verifyToken($headers);
        if (!$session) {
            http_response_code(401);
            echo json_encode(['success' => false, 'authenticated' => false, 'message' => 'Session expirée.']);
            exit;
        }
        echo json_encode(['success' => true, 'authenticated' => true, 'user' => ['name' => 'Falikou FOFANA', 'role' => 'admin']]);
        exit;
    }
}

// 2. PORTFOLIO DATA ROUTE
if ($route === 'portfolio' || empty($route)) {
    if ($method === 'GET') {
        $data = getPortfolioData($dataFile, $defaultFile);
        echo json_encode(['success' => true, 'data' => $data, 'source' => 'local_php']);
        exit;
    }

    if ($method === 'POST' || $method === 'PUT') {
        $session = verifyToken($headers);
        if (!$session) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Accès non autorisé.']);
            exit;
        }

        $newData = isset($body['data']) ? $body['data'] : null;
        if (!$newData) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Données invalides.']);
            exit;
        }

        $action = isset($body['action']) ? $body['action'] : 'publish';
        if ($action === 'publish') {
            $newData['settings']['lastPublished'] = date('c');
        }

        savePortfolioData($dataFile, $newData);

        echo json_encode([
            'success' => true,
            'message' => $action === 'publish' ? 'Portfolio publié avec succès !' : 'Brouillon sauvegardé.',
            'data' => $newData
        ]);
        exit;
    }
}

// 3. MESSAGES ROUTE
if ($route === 'messages') {
    if ($method === 'POST') {
        $name = isset($body['name']) ? trim($body['name']) : '';
        $email = isset($body['email']) ? trim($body['email']) : '';
        $subject = isset($body['subject']) ? trim($body['subject']) : 'Prise de contact';
        $message = isset($body['message']) ? trim($body['message']) : '';

        if (!$name || !$email || !$message) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Champs obligatoires manquants.']);
            exit;
        }

        $data = getPortfolioData($dataFile, $defaultFile);
        if (!isset($data['messages']) || !is_array($data['messages'])) {
            $data['messages'] = [];
        }

        $newMsg = [
            'id' => 'msg-' . time(),
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'read' => false,
            'date' => date('c')
        ];

        array_unshift($data['messages'], $newMsg);
        savePortfolioData($dataFile, $data);

        echo json_encode(['success' => true, 'message' => 'Message reçu avec succès !', 'data' => $newMsg]);
        exit;
    }
}

http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Route non trouvée.']);
