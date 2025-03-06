class FormRenderer {
    constructor(container) {
        this.container = container;
    }

    render(formSchema) {
        const form = document.createElement('form');
        form.id = 'dynamic-form';
        form.className = 'needs-validation';
        form.noValidate = true;

        // Add hidden input for form ID
        const formIdInput = document.createElement('input');
        formIdInput.type = 'hidden';
        formIdInput.name = 'form_id';
        formIdInput.value = formSchema.form.id;
        form.appendChild(formIdInput);

        // Add title and description
        if (formSchema.form.title) {
            const title = document.createElement('h2');
            title.className = 'mb-3';
            title.textContent = formSchema.form.title;
            form.appendChild(title);
        }

        if (formSchema.form.description) {
            const desc = document.createElement('p');
            desc.className = 'mb-4';
            desc.textContent = formSchema.form.description;
            form.appendChild(desc);
        }

        // Render form sections
        formSchema.form.sections.forEach(section => {
            form.appendChild(this.renderSection(section));
        });

        // Add submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary';
        submitBtn.textContent = 'Submit';
        form.appendChild(submitBtn);

        // Clear container and append new form
        this.container.innerHTML = '';
        this.container.appendChild(form);

        // Apply theme if specified
        if (formSchema.form.theme) {
            this.applyTheme(formSchema.form.theme);
        }
    }

    renderSection(section) {
        const div = document.createElement('div');
        div.className = 'form-section';

        switch (section.type) {
            case 'text':
                return this.renderTextInput(section);
            case 'textarea':
                return this.renderTextarea(section);
            case 'radio':
                return this.renderRadioGroup(section);
            case 'checkbox':
                return this.renderCheckboxGroup(section);
            case 'select':
                return this.renderSelect(section);
            case 'date':
                return this.renderDateInput(section);
            case 'file':
                return this.renderFileInput(section);
            default:
                console.warn(`Unsupported section type: ${section.type}`);
                return div;
        }
    }

    renderTextInput(section) {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = section.label;
        if (section.required) {
            label.innerHTML += '<span class="required-mark">*</span>';
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.name = this.generateFieldName(section.label);
        input.placeholder = section.placeholder || '';
        input.required = section.required || false;

        if (section.validation) {
            if (section.validation.min_length) {
                input.minLength = section.validation.min_length;
            }
            if (section.validation.max_length) {
                input.maxLength = section.validation.max_length;
            }
        }

        div.appendChild(label);
        div.appendChild(input);

        if (section.hint) {
            const hint = document.createElement('div');
            hint.className = 'form-hint';
            hint.textContent = section.hint;
            div.appendChild(hint);
        }

        return div;
    }

    renderTextarea(section) {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = section.label;
        if (section.required) {
            label.innerHTML += '<span class="required-mark">*</span>';
        }

        const textarea = document.createElement('textarea');
        textarea.className = 'form-control';
        textarea.name = this.generateFieldName(section.label);
        textarea.placeholder = section.placeholder || '';
        textarea.required = section.required || false;
        textarea.rows = section.rows || 3;

        div.appendChild(label);
        div.appendChild(textarea);

        if (section.hint) {
            const hint = document.createElement('div');
            hint.className = 'form-hint';
            hint.textContent = section.hint;
            div.appendChild(hint);
        }

        return div;
    }

    renderRadioGroup(section) {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = section.label;
        if (section.required) {
            label.innerHTML += '<span class="required-mark">*</span>';
        }
        div.appendChild(label);

        const fieldName = this.generateFieldName(section.label);

        section.options.forEach((option, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'form-check';

            const input = document.createElement('input');
            input.type = 'radio';
            input.className = 'form-check-input';
            input.name = fieldName;
            input.id = `${fieldName}_${index}`;
            input.value = option;
            input.required = section.required || false;

            const optionLabel = document.createElement('label');
            optionLabel.className = 'form-check-label';
            optionLabel.htmlFor = `${fieldName}_${index}`;
            optionLabel.textContent = option;

            wrapper.appendChild(input);
            wrapper.appendChild(optionLabel);
            div.appendChild(wrapper);
        });

        return div;
    }

    renderCheckboxGroup(section) {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = section.label;
        if (section.required) {
            label.innerHTML += '<span class="required-mark">*</span>';
        }
        div.appendChild(label);

        const fieldName = this.generateFieldName(section.label);

        section.options.forEach((option, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'form-check';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'form-check-input';
            input.name = `${fieldName}[]`; // 使用数组形式提交多选值
            input.id = `${fieldName}_${index}`;
            input.value = option;

            // 如果是必填，至少选择一个
            if (section.required) {
                input.setAttribute('data-group-required', fieldName);
            }

            const optionLabel = document.createElement('label');
            optionLabel.className = 'form-check-label';
            optionLabel.htmlFor = `${fieldName}_${index}`;
            optionLabel.textContent = option;

            wrapper.appendChild(input);
            wrapper.appendChild(optionLabel);
            div.appendChild(wrapper);
        });

        // 如果是必填，添加验证逻辑
        if (section.required) {
            const validateCheckboxGroup = () => {
                const checkboxes = div.querySelectorAll(`input[data-group-required="${fieldName}"]`);
                const checked = Array.from(checkboxes).some(cb => cb.checked);
                checkboxes.forEach(cb => {
                    cb.setCustomValidity(checked ? '' : 'Please select at least one option');
                });
            };

            div.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', validateCheckboxGroup);
            });
        }

        return div;
    }

    renderSelect(section) {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = section.label;
        if (section.required) {
            label.innerHTML += '<span class="required-mark">*</span>';
        }

        const select = document.createElement('select');
        select.className = 'form-select';
        select.name = this.generateFieldName(section.label);
        select.required = section.required || false;

        // Add default option if placeholder exists
        if (section.placeholder) {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = section.placeholder;
            defaultOption.selected = true;
            defaultOption.disabled = true;
            select.appendChild(defaultOption);
        }

        // Add options
        section.options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });

        div.appendChild(label);
        div.appendChild(select);

        if (section.hint) {
            const hint = document.createElement('div');
            hint.className = 'form-hint';
            hint.textContent = section.hint;
            div.appendChild(hint);
        }

        return div;
    }

    renderDateInput(section) {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = section.label;
        if (section.required) {
            label.innerHTML += '<span class="required-mark">*</span>';
        }

        const input = document.createElement('input');
        input.type = 'date';
        input.className = 'form-control';
        input.name = this.generateFieldName(section.label);
        input.required = section.required || false;

        if (section.validation) {
            if (section.validation.min) {
                input.min = section.validation.min;
            }
            if (section.validation.max) {
                input.max = section.validation.max;
            }
        }

        div.appendChild(label);
        div.appendChild(input);

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'invalid-feedback';
        feedbackDiv.textContent = `Please select a valid date`;
        div.appendChild(feedbackDiv);

        return div;
    }

    renderFileInput(section) {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = section.label;
        if (section.required) {
            label.innerHTML += '<span class="required-mark">*</span>';
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.className = 'form-control';
        input.name = this.generateFieldName(section.label);
        input.required = section.required || false;
        
        if (section.accept) {
            input.accept = section.accept;
        }

        if (section.validation && section.validation.max_size) {
            input.dataset.maxSize = section.validation.max_size;
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.size > section.validation.max_size) {
                    input.setCustomValidity(`File size must be less than ${section.validation.max_size / 1024 / 1024}MB`);
                } else {
                    input.setCustomValidity('');
                }
            });
        }

        div.appendChild(label);
        div.appendChild(input);

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'invalid-feedback';
        feedbackDiv.textContent = `Please choose a valid file`;
        div.appendChild(feedbackDiv);

        // Add help text for file size limit if specified
        if (section.validation && section.validation.max_size) {
            const helpText = document.createElement('div');
            helpText.className = 'form-text';
            helpText.textContent = `Maximum file size: ${section.validation.max_size / 1024 / 1024}MB`;
            div.appendChild(helpText);
        }

        return div;
    }

    createFormField(fieldSchema) {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = fieldSchema.label;
        fieldContainer.appendChild(label);

        let input;

        switch (fieldSchema.type) {
            case 'radio':
                const radioGroup = document.createElement('div');
                fieldSchema.options.forEach(option => {
                    const radioDiv = document.createElement('div');
                    radioDiv.className = 'form-check';

                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.className = 'form-check-input';
                    radioInput.name = fieldSchema.name;
                    radioInput.value = option.value;
                    radioInput.id = `${fieldSchema.name}_${option.value}`;
                    radioInput.required = fieldSchema.required;

                    const radioLabel = document.createElement('label');
                    radioLabel.className = 'form-check-label';
                    radioLabel.htmlFor = `${fieldSchema.name}_${option.value}`;
                    radioLabel.textContent = option.label;

                    radioDiv.appendChild(radioInput);
                    radioDiv.appendChild(radioLabel);
                    radioGroup.appendChild(radioDiv);
                });
                input = radioGroup;
                break;

            case 'date':
                input = document.createElement('input');
                input.type = 'date';
                input.className = 'form-control';
                input.name = fieldSchema.name;
                input.required = fieldSchema.required;
                break;

            case 'file':
                input = document.createElement('input');
                input.type = 'file';
                input.className = 'form-control';
                input.name = fieldSchema.name;
                input.required = fieldSchema.required;
                input.accept = fieldSchema.accept || '';
                
                if (fieldSchema.validation && fieldSchema.validation.maxSize) {
                    input.dataset.maxSize = fieldSchema.validation.maxSize;
                    input.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file && file.size > fieldSchema.validation.maxSize) {
                            input.setCustomValidity(`File size must be less than ${fieldSchema.validation.maxSize / 1024 / 1024}MB`);
                        } else {
                            input.setCustomValidity('');
                        }
                    });
                }
                break;

            default:
                input = document.createElement('input');
                input.type = fieldSchema.type || 'text';
                input.className = 'form-control';
                input.name = fieldSchema.name;
                input.placeholder = fieldSchema.placeholder || '';
                input.required = fieldSchema.required;
                
                if (fieldSchema.validation) {
                    if (fieldSchema.validation.minLength) {
                        input.minLength = fieldSchema.validation.minLength;
                    }
                    if (fieldSchema.validation.maxLength) {
                        input.maxLength = fieldSchema.validation.maxLength;
                    }
                }
        }

        fieldContainer.appendChild(input);

        // Add validation feedback div
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'invalid-feedback';
        feedbackDiv.textContent = `Please provide a valid ${fieldSchema.label.toLowerCase()}`;
        fieldContainer.appendChild(feedbackDiv);

        return fieldContainer;
    }

    generateFieldName(label) {
        return label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    applyTheme(theme) {
        const root = document.documentElement;
        if (theme.primary_color) {
            root.style.setProperty('--primary-color', theme.primary_color);
        }
        if (theme.font_family) {
            root.style.setProperty('--font-family', theme.font_family);
        }
    }
}
