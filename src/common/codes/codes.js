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

        var getCodes = function () {
            $http.get(urlBase).success(function (c) {
                codes = c;
                gameCodes = [];
                for (var i = 0; i < codes.length; i++) {
                    if (codes[i].gameIndex > 0) {
                        gameCodes.push(codes[i]);
                    }
                }
                notifyObservers();
            }).error(function (err) {
                console.log('qrHunt.services.codeFactory.getCodes: Unable to load all codes: ' + err.message);
            });

        };

        getCodes();

        codeFactory.getCodes = function () {
            return codes;
        };

        codeFactory.getGameCodes = function () {
            return gameCodes;
        };


        codeFactory.deleteCode = function (id) {
            $http['delete'](urlBase + '/' + id)
                .success(function () {
                    getGameCodes();
                    getCodes();
                }).error(function (err) {
                    console.log('qrHunt.services.codeFactory.deleteCode: Unable to remove code: ' + err.message);
                });
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
                getCodes();
            }).error(function (err) {
                console.log('qrHunt.services.codeFactory.saveCode: Unable to save codes: ' + err.message);
            });
        };

        codeFactory.reload = function () {
            getCodes();
        };
        return codeFactory;
    }]);

