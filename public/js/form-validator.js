class FormValidator {
    constructor(form) {
        this.form = form;
        this.formPath = window.location.pathname;
        this.formId = form.getAttribute('id') || 'default';
        this.setupValidation();
        this.checkFormSubmission();
    }

    setupValidation() {
        this.form.addEventListener('submit', (event) => {
            if (!this.form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                this.handleSubmit();
            }
            this.form.classList.add('was-validated');
        });
    }

    validateField(field) {
        const value = field.value;
        const validation = field.dataset.validation ? JSON.parse(field.dataset.validation) : {};

        if (validation.required && !value) {
            return { valid: false, message: 'This field is required' };
        }

        if (validation.minLength && value.length < validation.minLength) {
            return { valid: false, message: `Minimum length is ${validation.minLength} characters` };
        }

        if (validation.maxLength && value.length > validation.maxLength) {
            return { valid: false, message: `Maximum length is ${validation.maxLength} characters` };
        }

        return { valid: true };
    }

    handleSubmit() {
        // Check if form has file inputs
        const hasFileInputs = Array.from(this.form.elements).some(element => element.type === 'file');

        if (hasFileInputs) {
            // Use FormData for forms with file uploads
            const formData = new FormData(this.form);
            formData.append('form_path', this.formPath);
            this.submitToServer(formData, true);
        } else {
            // Use JSON for forms without file uploads
            const formData = new FormData(this.form);
            const data = {
                form_id: this.formId,
                form_path: this.formPath
            };
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            this.submitToServer(data, false);
        }
    }

    submitToServer(data, isFormData) {
        const self = this;
        const csrfToken = document.getElementById('csrf-token').value;
        
        $.ajax({
            url: '/submit.php',
            method: 'POST',
            data: isFormData ? data : JSON.stringify(data),
            processData: !isFormData,
            contentType: isFormData ? false : 'application/json',
            headers: {
                'X-CSRF-Token': csrfToken
            },
            success: function(response) {
                if (response.success) {
                    // Record form submission
                    self.recordFormSubmission();
                    // Redirect to thank you page
                    const formName = self.formPath.split('/').pop() || 'default';
                    window.location.href = `/thank-you.php?form=${formName}`;
                } else {
                    alert('Error: ' + (response.error || 'Failed to submit form'));
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('Error submitting form: ' + error);
            }
        });
    }

    checkFormSubmission() {
        const submittedForms = JSON.parse(localStorage.getItem('submittedForms') || '[]');
        if (submittedForms.includes(this.formPath)) {
            // 如果表单已提交，显示消息并禁用表单
            this.form.innerHTML = `
                <div class="alert alert-info">
                    <h4>You have already submitted this form.</h4>
                    <p>Thank you for your response. You cannot submit this form again.</p>
                    <a href="/" class="btn btn-primary mt-3">Return to Home</a>
                </div>
            `;
        }
    }

    recordFormSubmission() {
        const submittedForms = JSON.parse(localStorage.getItem('submittedForms') || '[]');
        submittedForms.push(this.formPath);
        localStorage.setItem('submittedForms', JSON.stringify(submittedForms));
    }
}
