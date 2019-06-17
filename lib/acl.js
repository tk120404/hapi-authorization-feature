// External modules
const Boom	= require('boom');
const _			= require('underscore');

// Declare of internals
const internals = {};


/**
 * Checks if the user has the wanted roles
 *
 * @param user	- The user to check if they have a role
 * @param role	- The role to check if the user has
 * @returns {*}
 */
exports.checkRoles = function(user, params) {
    if ((!user) || (!internals.isGranted(user, params))) {
        return Boom.forbidden('Unauthorized');
    }

    return null;
};

/**
 * Checks if the provided user role/functionality and feature/subset is included is the required role/functionality and feature/subfeature respectively
 *
 * @param userRole			- The role(s) that the user has
 * @param requiredRole	- The role(s) that is required
 * @returns {boolean}		- True/False whether the user has access
 */
internals.isGranted = function(user, params) {
    let userRoles = user.roles;
    let userFunctionalities = user.functionalities;
    let userFeatures = user.features;
    let userSubset = user.subset;
    let accessGranted = false;
    if (!params.validateFeature || userFeatures && userFeatures.indexOf(params.feature) !== -1 || userSubset && userSubSet.indexOf(params.subset) !== -1) {
        if (userRoles && userRoles.indexOf(params.role) !== -1 || userFunctionalities && userFunctionalities.indexOf(params.functionality) !== -1) {
            accessGranted = true;
        }
    }
    return accessGranted;

};