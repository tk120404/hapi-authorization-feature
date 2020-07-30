const Joi = require('@hapi/joi');
const Hoek = require('@hapi/hoek');

// Internals
const internals = {};

/**
 * Assert that the params are valid for the type passed in
 *
 * @param type    - The type of object we want to validate for. i.e. route, plugin
 * @param options  - The JSON object to be validated
 * @param message  - Part of the message if validation fails
 * @returns {*}
 */
exports.assert = function(type, options, message) {

    const validationObj = Joi.validate(options, internals[type]);
    const error = validationObj.error;
    let errorMessage = null;

    // If there is an error, build a nice error message
    if (error) {
        errorMessage = error.name + ':';
        error.details.forEach(function(err) {
            errorMessage += ' ' + err.message;
        });
    }

    // If there is an error build the error message
    Hoek.assert(!error, 'Invalid', type, 'options', message ? '(' + message + ')' : '', errorMessage);

    return validationObj.value;
};


/**
 * Validation rules for a route's params
 */
internals.route = Joi.object({
    role: [Joi.string().optional()],
    feature: Joi.string().default(null).when('validateFeature', { is: true, then: Joi.required() }),
    validateFeature: Joi.boolean().default(true),
    function: Joi.string().optional(),
    subfeature: Joi.string().optional()

}).without('role', 'roles').options({ allowUnknown: false });


/**
 * Validation rules for the plugin's params
 */
internals.plugin = Joi.object({
    roles: [Joi.array().optional(), Joi.bool().allow(false).optional()],
    functions: [Joi.array().optional()],
    features: [Joi.array().optional()],
    subfeatures: [Joi.array().optional()]
}).options({ allowUnknown: false });