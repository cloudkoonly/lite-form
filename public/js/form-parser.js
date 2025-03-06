class FormParser {
    constructor() {
        this.formData = null;
    }

    parseYAML(yamlContent) {
        try {
            this.formData = jsyaml.load(yamlContent);
            return this.formData;
        } catch (e) {
            console.error('Error parsing YAML:', e);
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
