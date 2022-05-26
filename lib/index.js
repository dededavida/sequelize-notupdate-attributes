"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelizeNoUpdate = (sequelize) => {
    if (!sequelize) {
        throw new Error('The required sequelize instance option is missing');
    }
    sequelize.addHook('beforeValidate', (instance, options) => {
        if (!options.validate)
            return;
        if (instance.isNewRecord)
            return;
        const changedKeys = [];
        const instance_changed = Array.from(instance._changed);
        instance_changed.forEach((value) => changedKeys.push(value));
        if (!changedKeys.length)
            return;
        const validationErrors = [];
        changedKeys.forEach((fieldName) => {
            const fieldDefinition = instance.rawAttributes[fieldName];
            if (!fieldDefinition.noUpdate)
                return;
            if (fieldDefinition.noUpdate.readOnly) {
                validationErrors.push(new sequelize_1.ValidationErrorItem(`\`${fieldName}\` cannot be updated due \`noUpdate:readOnly\` constraint`, 'readOnly Violation', fieldName, instance[fieldName]));
                return;
            }
            if (instance._previousDataValues[fieldName] !== undefined &&
                instance._previousDataValues[fieldName] !== null) {
                validationErrors.push(new sequelize_1.ValidationErrorItem(`\`${fieldName}\` cannot be updated due \`noUpdate\` constraint`, 'noUpdate Violation', fieldName, instance[fieldName]));
            }
        });
        if (validationErrors.length)
            throw new sequelize_1.ValidationError(null, validationErrors);
    });
    return sequelize;
};
exports.default = sequelizeNoUpdate;
//# sourceMappingURL=index.js.map