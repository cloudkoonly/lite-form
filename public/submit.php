<?php
session_start();
header('Content-Type: application/json');

// Helper function for XSS filtering
function sanitize_input($data) {
    if (is_array($data)) {
        return array_map('sanitize_input', $data);
    }
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

// Process the form data
try {
    // Verify CSRF token
    $headers = getallheaders();
    $token = $headers['X-Csrf-Token'] ?? '';
    if (empty($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        throw new Exception('Invalid CSRF token');
    }

    // Get form data based on content type
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? $_SERVER["CONTENT_TYPE"] : '';
    
    if (strpos($contentType, 'application/json') !== false) {
        // Handle JSON data
        $jsonData = file_get_contents('php://input');
        $formData = json_decode($jsonData, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data');
        }
    } else {
        // Handle form data
        $formData = $_POST;
    }

    // Validate the data
    if (empty($formData)) {
        throw new Exception('No data received');
    }

    // Apply XSS filtering
    $formData = sanitize_input($formData);

    // Add timestamp
    $formData['submitted_at'] = date('Y-m-d H:i:s');
    
    // Get form ID
    $formId = isset($formData['form_id']) ? $formData['form_id'] : 'default';
    
    // Create form-specific directories
    $dirPath = __DIR__ . '/../submissions/' . $formId . '_form';
    $uploadPath = $dirPath . '/uploads';
    
    // Create directories if they don't exist
    if (!file_exists($dirPath)) {
        mkdir($dirPath, 0777, true);
    }
    if (!file_exists($uploadPath)) {
        mkdir($uploadPath, 0777, true);
    }

    // Handle file uploads
    if (!empty($_FILES)) {
        $formData['files'] = [];
        foreach ($_FILES as $fieldName => $fileInfo) {
            if ($fileInfo['error'] === UPLOAD_ERR_OK) {
                // Generate unique filename
                $fileExt = pathinfo($fileInfo['name'], PATHINFO_EXTENSION);
                $newFileName = uniqid() . '.' . $fileExt;
                $filePath = $uploadPath . '/' . $newFileName;
                
                // Move uploaded file
                if (move_uploaded_file($fileInfo['tmp_name'], $filePath)) {
                    $formData['files'][$fieldName] = [
                        'original_name' => $fileInfo['name'],
                        'saved_name' => $newFileName,
                        'type' => $fileInfo['type'],
                        'size' => $fileInfo['size']
                    ];
                } else {
                    throw new Exception('Failed to save uploaded file: ' . $fileInfo['name']);
                }
            } else if ($fileInfo['error'] !== UPLOAD_ERR_NO_FILE) {
                throw new Exception('File upload error: ' . $fileInfo['error']);
            }
        }
    }
    
    // Generate unique filename for form data
    $filename = $dirPath . '/' . date('Y-m-d_H-i-s') . '_' . uniqid() . '.json';
    
    // Save the submission
    if (file_put_contents($filename, json_encode($formData, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
    } else {
        throw new Exception('Failed to save submission');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
