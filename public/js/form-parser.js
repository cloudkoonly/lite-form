class FormParser {
    constructor() {
        this.formData = null;
    }

    parseYAML(content) {
        try {
            // If content is already an object (parsed JSON), use it directly
            if (typeof content === 'object' && content !== null) {
                this.formData = content;
            } else {
                // Otherwise parse as YAML
                this.formData = jsyaml.load(content);
            }
            this.validateSchema(this.formData);
            return this.formData;
        } catch (e) {
            console.error('Error parsing form configuration:', e);
            throw e;
        }
    }

    getFormSchema() {
        return this.formData;
    }

    validateSchema(schema) {
        // Basic schema validation
        if (!schema.form) {
            throw new Error('Invalid schema: missing form object');
        }

        if (!schema.form.sections || !Array.isArray(schema.form.sections)) {
            throw new Error('Invalid schema: sections must be an array');
        }

        return true;
    }
}
