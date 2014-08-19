# QR-Hunt Client
QR Hunt game - client, made for Open Day 2014

### Foundation
The client is written for [AngularJS](https://angularjs.org/) leveraging the popular `ngBoilerplate` build management system found here: [GitHub Repository](https://github.com/ngbp/ngbp).

### Dependencies
* [Karma](http://karma-runner.github.io): JavaScript test environment and runner.
* [Bower](http://bower.io): A package manager for the web.
* [Node.js](http://nodejs.org): Asynchronous event driven framework written on top of Chrome's JavaScript runtime.
* [Grunt](http://gruntjs.com): A JavaScript Task Runner.

### Building
```
$ git clone git://github.com/ITatJCU/qr-hunt-client
$ cd qr-hunt-client
$ [sudo] npm install -g grunt-cli karma bower
$ npm install
$ bower install
$ grunt watch
```
With `grunt` watching the project directory for changes, open the `index.html` file within the build sub-directory.

Any alterations made within the `src` will be compiled, tested, and rebuilt.
