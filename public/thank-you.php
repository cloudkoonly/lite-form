<?php
$formName = isset($_GET['form']) ? htmlspecialchars($_GET['form']) : 'default';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center">
                <h1 class="display-4 mb-4">Thank You!</h1>
                <p class="lead">Your response has been submitted successfully.</p>
                <p class="mb-4">We appreciate your time and feedback.</p>
                <a href="/" class="btn btn-primary">Return to Home</a>
            </div>
        </div>
    </div>
</body>
</html>
