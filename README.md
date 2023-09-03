# react-test-task

## Installation
Install `npm` dependencies:
```
  npm install
```

Run `docker` backend containers.

If you run the backend service on the dedicated server, change `frontTestServiceBaseURL` in the `configuration file`.

For a local testing just run:
```
  docker-compose up
```

Run `Vite` frontend development server:

```
  npm run dev
```

## Configuration

Core project config location `/src/cfg/index.ts`;

```js
  frontTestServiceBaseURL: 'localhost:8008', // backend service base url
  authJWTCookieName: 'token', // JWT cookie name
  authLoginCookieName: 'LOGIN', // user login cookie name
  userInactiveThresholdTime: 180000, // inactive threshold time for socket closure 
```

## [Technical specification](https://docs.google.com/document/d/e/2PACX-1vSQmGsj3DWsHZngl8K_tfireSvrk-MRxiJQfB1nc2CYpPZRSNJMZA_GwzYOQSiWEydJabs-5HJz7auc/pub)
