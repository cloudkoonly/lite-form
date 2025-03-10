<?php
// Get the path from URL
$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);
$pathSegments = explode('/', $path);
$formName = end($pathSegments);

if (empty($formName)) {
    $formName = 'default'; // Default form if no path specified
}

// Map URL path to config files
$formFile = __DIR__ . '/../data/forms/' . $formName . '_form';
$jsonFile = $formFile . '.json';
$yamlFile = $formFile . '.yaml';

// Check if YAML or JSON file exists
$configFile = null;
$isJson = false;

if (file_exists($jsonFile)) {
    $configFile = $jsonFile;
    $isJson = true;
} elseif (file_exists($yamlFile)) {
    $configFile = $yamlFile;
} else {
    header("HTTP/1.0 404 Not Found");
    echo "Form template not found";
    exit;
}

// Load content
$fileContent = file_get_contents($configFile);

// Start session for CSRF token
session_start();

// Generate CSRF token if not exists
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrf_token = $_SESSION['csrf_token'];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/style.css?v=1.0" rel="stylesheet">
</head>
<body>
    <div class="content-wrapper">
        <div class="container mt-4">
            <div id="form-container">
                <!-- Dynamic form will be rendered here -->
            </div>
        </div>
    </div>
    <footer>
        <div class="container">
            <span>Posted by <span id="posted-by">-</span></span>
        </div>
    </footer>

    <!-- Add CSRF token as hidden input -->
    <input type="hidden" id="csrf-token" value="<?php echo $csrf_token; ?>">

    <!-- JS-YAML for YAML parsing -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="/js/form-parser.js"></script>
    <script src="/js/form-renderer.js"></script>
    <script src="/js/form-validator.js"></script>
    <script>
        // Initialize form with the YAML content
        $(document).ready(function() {
            const formContainer = document.getElementById('form-container');
            const formRenderer = new FormRenderer(formContainer);
            const formParser = new FormParser();

            try {
                let fileContent = <?php echo json_encode($fileContent); ?>;
                if(<?php echo $isJson ? 'true' : 'false'; ?>){
                    fileContent = JSON.parse(fileContent);
                }
                const formSchema = formParser.parseYAML(fileContent);
                formRenderer.render(formSchema);
                console.log('Form schema:', formSchema);
                // Set posted by in footer
                document.getElementById('posted-by').textContent = formSchema.form.posted_by || 'Anonymous';

                // Initialize form validation
                const form = document.getElementById('dynamic-form');
                if (form) {
                    new FormValidator(form);
                }
            } catch (e) {
                console.error('Error initializing form:', e);
                formContainer.innerHTML = '<div class="alert alert-danger">Error loading form configuration</div>';
            }
        });
    </script>
</body>
</html>
