angular.module('codes', [])

    .factory('codeFactory', ['$http', function ($http) {

        var observers = [];

        var server = "http://127.0.0.1:8080";
        var urlBase = server + '/codes';
        var codeFactory = {};
        var codes = [];
        var gameCodes = [];

        codeFactory.addObserver = function (callback) {
            observers.push(callback);
        };

        codeFactory.removeObserver = function (callback) {
            var callbackIndex = array.indexOf(callback);

            if (callbackIndex > -1) {
                array.splice(callbackIndex, 1);
            }
        };

        var notifyObservers = function () {
            angular.forEach(observers, function (callback) {
                callback();
            });
        };

        var getGameCodes = function () {
            $http.get(server + '/gameCodes').success(function (c) {
                gameCodes = c;
                notifyObservers();
            }).error(function (err) {
                console.log('qrHunt.services.codeFactory.getGameCodes: Unable to load game codes: ' + err.message);
            });
        };

        var getCodes = function () {
            $http.get(urlBase).success(function (c) {
                codes = c;
                notifyObservers();
            }).error(function (err) {
                console.log('qrHunt.services.codeFactory.getCodes: Unable to load all codes: ' + err.message);
            });

        };

        getGameCodes();
        getCodes();

        codeFactory.getCodes = function () {
            return codes;
        };

        codeFactory.getGameCodes = function () {
            return gameCodes;
        };


        codeFactory.getCode = function (id, callback) {
            var c = null;

            var code;
            for (var i = 0; i < codes.length; i++) {
                code = codes[i];
                if (code.id == id) {
                    c = code;
                    break;
                }
            }

            if (callback) {
                callback(c);
            }
        };

        codeFactory.saveCode = function (code) {
            $http.put(urlBase, code).success(function () {
                getGameCodes();
                getCodes();
            }).error(function (err) {
                console.log('qrHunt.services.codeFactory.saveCode: Unable to save codes: ' + err.message);
            });
        };

        codeFactory.reload = function () {
            getGameCodes();
            getCodes();
        };
        return codeFactory;
    }]);

