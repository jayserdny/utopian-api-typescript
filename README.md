# Utopian SDK Typescript [![Build Status](https://travis-ci.org/jayserdny/utopian-api-typescript.svg?branch=v1.0.2)](https://travis-ci.org/jayserdny/utopian-api-typescript)

A Typescript module for Utopian SDK. Originally written by [wehmoen](https://github.com/wehmoen)

## Installation 
```sh
npm install utopian-api-ts --save
yarn add utopian-api-ts
bower install utopian-api-ts --save
```
## Usage
### Javascript
```javascript
var utopiansdk = require('utopian-api-ts');
utopiansdk.getModerators(function(data) {
    console.log(data);
});
```
```sh
Output should be an array with the moderators
```
### TypeScript
```typescript
import * as utopiansdk from 'utopian-api-ts';
utopiansdk.getModerators((data) => {
    console.log(data);
});
```
```sh
Output should be an array with the moderators
```
### AMD
```javascript
define(function(require,exports,module){
  var utopiansdk = require('utopian-api-ts');
});
```
## Test 
```sh
npm run test
```