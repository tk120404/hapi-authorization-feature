# hapi-authorization-feature

*hapi-authorization-feature  only supports hapi 17+*

> ACL plugin along with features check in hapijs

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dev Dependencies][david-badge]][david-url]

You can use this plugin to add ACL and protect your routes. you can configure required roles/functions along with features/subfeatures and allow access to certain endpoints only to specific users.


# Usage

**Note**: To use hapi-authorization-feature you must have an authentication strategy defined.

There are 2 ways to use hapi-authorization-feature:

1. With the default roles which are: "SUPER_ADMIN", "ADMIN", "USER", "GUEST"
2. By defining your own roles/functions and features/subfeatures

## Using hapi-authorization-feature with default roles
1. Include the plugin in your hapijs app.
Example:
```js
let plugins = [
	{
		plugin: require('hapi-auth-basic')
	},
	{
		plugin: require('hapi-authorization-feature')
		options: {
		  roles: false	// By setting to false, you are not using an authorization hierarchy and you do not need to specify all the potential roles here
		}
	}
];

await server.register(plugins);
```

## Using hapi-authorization-feature with custom roles and features
1. Include the plugin in your hapijs app.
Example:
```js
let plugins = [
	{
		plugin: require('hapi-auth-basic')
	},
	{
		plugin: require('hapi-authorization-feature'),
		options: {
			roles: ['OWNER', 'MANAGER', 'EMPLOYEE'],
			functions:['CREATEMANAGER','CREATEEMPLOYEE','UPDATEMANAGER','UPDATEEMPLOYEE','DELETEMANAGER','DELETEEMPLOYEE'],
			features:['OWNERMANAGEMENT','MANAGERMANAGEMENT','EMPLOYEEMANAGEMENT'],
			subfeatures:['OWNERCREATION','OWNERUPDATION','OWNERDELETION']
		}
	}
];

await server.register(plugins);
```

#### Whitelist Routes That Require Authorization
If you want no routes require authorization except for the ones you specify in the route config, add hapiAuthorization instructions with the role(s) that should have access to the route configuration.

Example:

**Authorize a single role or function without feature check**
```js
server.route({ method: 'GET', path: '/', options: {
  plugins: {'hapiAuthorizationFeature': {role: 'ADMIN',validateFeature:false, function: 'CREATEMANAGER'}},	// Only ADMIN role
  handler: (request, h) => { return "Great!"; }
}});
```

**Authorize multiple roles with one feature**
```js
server.route({ method: 'GET', path: '/', options: {
  plugins: {'hapiAuthorizationFeature': {roles: ['USER', 'ADMIN'],feature:'OWNERMANAGEMENT' ,function: 'CREATEMANAGER' }},
  handler: (request, h) => { return "Great!"; }
}});
```

#### Blacklist All Routes To Require Authorization

If you want all routes to require authorization except for the ones you specify that should not, add hapiAuthorization instructions with the role(s) that should have access to the server.connection options. Note that these can be overridden on each route individually as well.

Example:

```js
let server = new Hapi.server({
	routes: {
		plugins: {
			hapiAuthorization: { role: 'ADMIN',  feature:'OWNERMANAGEMENT' ,function: 'CREATEMANAGER' ,subfeature:'OWNERCREATION' }
		}
	}
});
```

**Override the authorization to require alternate roles**
```js
server.route({ method: 'GET', path: '/', options: {
  plugins: {'hapiAuthorizationFeature': {role: 'USER', feature:'USERMANAGEMENT' ,function: 'CREATEUSER' ,subfeature:'USERCREATION'}},	// Only USER role
  handler: (request, h) => { return "Great!" ;}
}});
```

**Override the authorization to not require any authorization**
```js
server.route({ method: 'GET', path: '/', options: {
  plugins: {'hapiAuthorizationFeature': false},
  handler: (request, h) => { return "Great!"; }
}});
```

**Note:** Every route that uses hapiAuthorization must be protected by an authentication schema either via `auth.strategy.default('someAuthStrategy')` or by specifying the auth on the route itself.

## Full Example using hapi-auth-basic and hapi-authorization-feature

```js
const Hapi = require('hapi');
const modules = require('./modules');

// Instantiate the server
let server = new Hapi.Server();

/**
 * The hapijs plugins that we want to use and their configs
 */
let plugins = [
	{
		register: require('hapi-auth-basic')
	},
	{
		register: require('hapi-authorization-feature'),
		options: {
			role: 'EMPLOYEE'
		}
	}
];

let validate = (username, password) => {
	// Perform authentication and respond with object that contains a role or an array of roles
	return {username: username, role: 'EMPLOYEE'};
}

/**
 * Setup the server with plugins
 */
await server.register(plugins);
server.start().then(() => {

	server.auth.strategy('simple', 'basic', {validateFunc: validate});
	server.auth.default('simple');

	/**
	 * Add all the modules within the modules folder
	 */
	for(let route in modules) {
		server.route(modules[route]);
	}

	/**
	 * Starts the server
	 */
	server.start()
        .then(() => {
            console.log('Hapi server started @', server.info.uri);
        })
        .catch((err) => {
            console.log(err);
        });
})
.catch((err) => {
  // If there is an error on server startup
  throw err;
});
```

## Gotchas

### Auth before routes
You must define your auth strategy before defining your routes, otherwise the route validation will fail.


## Plugin Config

* `roles` - `Array|false`: All the possible roles. Defaults to `SUPER_ADMIN`, `ADMIN`, `USER`, `GUEST`. 
* `functions` - `Array`: All the possible functions of the each roles
* `features` - `Array`: All the possible features 
* `subfeatures` - `Array`: All the possible subfeatures of each features


## Route config of supported parameters:
* `role` - `String`: enforces that only users that have this role can access the route or
* `function` - `String`: enforces that only users that have this function can access the route and
* `feature` - `String`: enforce that only users that have this feature can access the route and
* `subfeature` - `String`: enforce that only users that have this subfeature can access the route


Thanks [toymachiner62]:https://github.com/toymachiner62/hapi-authorization

[npm-badge]: https://badge.fury.io/js/hapi-authorization-feature.svg
[npm-url]: https://badge.fury.io/js/hapi-authorization-feature
[travis-badge]: https://travis-ci.org/tk120404/hapi-authorization-feature.svg?branch=master
[travis-url]: https://travis-ci.org/tk120404/hapi-authorization-feature
[coveralls-badge]: https://coveralls.io/repos/tk120404/hapi-authorization-feature/badge.svg?branch=master&service=github
[coveralls-url]:  https://coveralls.io/github/tk120404/hapi-authorization-feature?branch=master
[david-badge]: https://david-dm.org/tk120404/hapi-authorization-feature.svg
[david-url]: https://david-dm.org/tk120404/hapi-authorization-feature
