/**
 * The default roles and role hierarchy if a custom one isn't passed in
 */

// The default roles
//const RoleTypes = {
//  SUPER_ADMIN: 'SUPER_ADMIN',
//  ADMIN: 'ADMIN',
//  USER: 'USER',
//  GUEST: 'GUEST'
//};

const SUPER_ADMIN = 'SUPER_ADMIN';
const ADMIN       = 'ADMIN';
const USER        = 'USER';
const GUEST       = 'GUEST';

// The default roles and hierarchy
const RoleTypes     = [SUPER_ADMIN, ADMIN, USER, GUEST];

module.exports = {
  roles    : RoleTypes
};