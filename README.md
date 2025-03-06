# Dynamic Form System

A flexible and secure form handling system, supporting dynamic form generation from YAML configurations.

## Features

- Dynamic form generation from YAML configuration files
- Support for multiple form types and field validations
- File upload handling
- Security features:
  - CSRF protection
  - XSS filtering
  - Input validation
- JSON and FormData submission support
- Submission history tracking
- Modern Bootstrap UI
- No Database required

## Directory Structure

```
form/
├── forms/                  # YAML form configurations
│   ├── default_form.yaml
│   └── code_form.yaml
├── public/                 # Public accessible files
│   ├── index.php          # Entry point
│   ├── submit.php         # Form submission handler
│   ├── css/               # CSS files
│   └── js/                # JavaScript files
│       ├── form-renderer.js
│       └── form-validator.js
├── submissions/           # Form submissions storage
│   └── uploads/          # Uploaded files storage
├── LICENSE               # MIT License
└── README.md            # This file
```

## Installation

1. Clone the repository
2. Ensure PHP 7.4+ is installed
3. Configure your web server to point to the `public` directory
4. Ensure write permissions for `submissions` directory

## Nginx Configuration

Add this to your Nginx server configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/form/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;  # Adjust according to your PHP-FPM setup
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to YAML files
    location ~ \.yaml$ {
        deny all;
        return 404;
    }

    # Deny access to sensitive directories
    location ~ ^/(forms|submissions) {
        deny all;
        return 404;
    }
}
```

## Usage

1. Default form: `http://your-domain/`, for `forms/default_form.yaml`
2. Specific form: `http://your-domain/myform`, for `forms/myform_form.yaml`

Example form configuration:
```yaml
form:
  id: "myform"
  version: "1.0.0"
  title: "My Custom Form"
  description: "Please fill out this form"
  theme:
    primary_color: "#2c3e50"
    background_color: "#ecf0f1"
    font_family: "Arial"
  fields:
    - type: "text"
      name: "full_name"
      label: "Full Name"
      required: true
      placeholder: "Enter your full name"
      validation:
        minLength: 2
        maxLength: 50
    - type: "email"
      name: "email"
      label: "Email Address"
      required: true
    - type: "file"
      name: "document"
      label: "Upload Document"
      required: false
```

Form submissions will be stored in JSON format in the `submissions` directory, organized by form ID.

## Security

- CSRF protection implemented via tokens
- XSS filtering for all user inputs
- Secure file upload handling
- Session-based security measures

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
