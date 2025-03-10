# Dynamic Form System

A flexible and secure form handling system, supporting dynamic form generation from both YAML and JSON configurations.

## Demo View

![Demo](https://file.cloudkoonly.com/data/lite-form/lite-form-demo.png)

## Features

- Dynamic form generation from YAML or JSON configuration files
- No Database required
- Support for multiple form types and field validations
- File upload handling
- Security features:
  - CSRF protection
  - XSS filtering
  - Input validation
- JSON and FormData submission support
- Submission history tracking
- Modern Bootstrap UI
- Form metadata display (Posted by, etc.)
- Responsive sticky footer

## Directory Structure

```
form/
├── data/                   # Data storage directory
│   ├── forms/             # Form configurations
│   │   ├── default_form.yaml
│   │   ├── default_form.json
│   │   └── code_form.yaml
│   └── submissions/       # Form submissions storage
│       └── uploads/       # Uploaded files storage
├── public/                # Public accessible files
│   ├── index.php         # Entry point
│   ├── submit.php        # Form submission handler
│   ├── css/              # CSS files
│   │   └── style.css     # Main stylesheet
│   └── js/               # JavaScript files
│       ├── form-parser.js
│       ├── form-renderer.js
│       └── form-validator.js
├── LICENSE               # MIT License
└── README.md            # This file
```

## Installation

1. Clone the repository
2. Ensure PHP 7.4+ is installed
3. Configure your web server to point to the `public` directory
4. Ensure write permissions for `data/submissions` directory

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

    # Deny access to YAML and JSON configuration files
    location ~ \.(yaml|json)$ {
        deny all;
        return 404;
    }

    # Deny access to sensitive directories
    location ~ ^/data/ {
        deny all;
        return 404;
    }
}
```

## Usage

1. Default form: `http://your-domain/`, loads either:
   - `data/forms/default_form.json` (preferred)
   - `data/forms/default_form.yaml` (fallback)
2. Specific form: `http://your-domain/myform`, loads either:
   - `data/forms/myform_form.json` (preferred)
   - `data/forms/myform_form.yaml` (fallback)

Example form configuration (JSON):
```json
{
  "form": {
    "id": "myform",
    "version": "1.0.0",
    "title": "My Custom Form",
    "description": "Please fill out this form",
    "posted_by": "Form Admin",
    "theme": {
      "primary_color": "#2c3e50",
      "background_color": "#ecf0f1",
      "font_family": "Arial"
    }
  }
}
```

Or in YAML:
```yaml
form:
  id: "myform"
  version: "1.0.0"
  title: "My Custom Form"
  description: "Please fill out this form"
  posted_by: "Form Admin"
  theme:
    primary_color: "#2c3e50"
    background_color: "#ecf0f1"
    font_family: "Arial"
```

## Form Sections

Form sections define the structure and fields of your form. Each section can be one of these types:
- text
- textarea
- select
- radio
- checkbox
- file
- date

See the example forms in `data/forms` directory for detailed configuration options.

## Security

- CSRF protection implemented via tokens
- XSS filtering for all user inputs
- Secure file upload handling
- Session-based security measures

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


#form #yaml #json #custom form #dynamic form