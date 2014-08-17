angular.module('players', [])

    .factory('playerFactory', ['$http', function ($http) {

        var observers = [];

        var uuid = new Fingerprint().get();
        var server = "http://127.0.0.1:8080";
        var urlBase = server + '/players';
        var playerFactory = {};
        var players = [];
        var player = null;

        var leaderBoard = [];

        playerFactory.addObserver = function (callback) {
            observers.push(callback);
        };

        playerFactory.removeObserver = function (callback) {
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

        var getPlayer = function () {

            $http.get(urlBase + '/' + uuid)
                .success(function (p) {
                    player = p;
                    notifyObservers();
                }).error(function (err) {
                    $http.put(urlBase,
                        {uuid: uuid}
                    ).success(function (p) {
                            player = p;
                            notifyObservers();
                        }).error(function (e) {
                            console.log('qrHunt.services.playerFactory.getCurrentPlayer: Unable to load current player: ' + e.message);
                        });
                });
        };

        var getAllPlayers = function () {
            $http.get(urlBase).success(function (p) {
                players = p;
                notifyObservers();
            }).error(function (err) {
                console.log('qrHunt.services.playerFactory.getPlayers: Unable to load players: ' + err.message);
            });
        };

        var getLeaderboard = function () {
            $http.get(server + '/leaderboard').success(function (leaders) {
                leaderBoard = leaders;
                notifyObservers();
            }).error(function (err) {
                console.log('qrHunt.services.playerFactory.getLeaderboard: Unable to load leaderboard: ' + err.message);
            });
        };


        var resetPlayer = function () {
            $http.put(urlBase + '/' + new Fingerprint().get() + '/reset')
                .success(function (p) {
                    player = p;
                    notifyObservers();
                }).error(function (err) {
                    console.log('qrHunt.services.playerFactory.getCurrentPlayer: Unable to load current player: ' + err.message);
                });
        };

        var addScan = function (id) {
            $http.put(urlBase + '/' + new Fingerprint().get() + '/' + id)
                .success(function (p) {
                    player = p;
                    notifyObservers();
                }).error(function (err) {
                    console.log('qrHunt.services.playerFactory.getCurrentPlayer: Unable to load current player: ' + err.message);
                });
        };

        playerFactory.reload = function () {
            getAllPlayers();
            getPlayer();
            getLeaderboard();
        };
        playerFactory.reload();

        playerFactory.getPlayer = function () {
            return player;
        };

        playerFactory.getPlayers = function () {
            return players;
        };

        playerFactory.getLeaderboard = function () {
            return leaderBoard;
        };

        playerFactory.resetPlayer = function () {
            resetPlayer();
        };

        playerFactory.scanned = function (id) {
            addScan(id);
        };
        return playerFactory;
    }]);
