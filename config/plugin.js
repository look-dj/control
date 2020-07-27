'use strict';

/** @type Egg.EggPlugin */


module.exports = {
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  }, mysql: {
    enable: true,
    package: 'egg-mysql',
  }
}