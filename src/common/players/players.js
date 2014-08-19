angular.module('players', [])

    .factory('playerFactory', ['SERVER_CONFIG', '$http', function (SERVER_CONFIG, $http) {

        var observers = [];

        var uuid = new Fingerprint().get();
        var server = SERVER_CONFIG.url;
        var urlBase = server + '/players';
        var playerFactory = {};
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
                    var d;

                    for (var i = 0; i < player.scans.length; i++) {
                        d = new Date(player.scans[i].createdAt + " UTC");
                        player.scans[i].createdAt = d.toISOString().slice(0, 10) + " " + d.toLocaleTimeString();
                    }

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
        var getLeaderboard = function () {
            $http.get(server + '/leaderboard').success(function (leaders) {
                leaderBoard = leaders;
                notifyObservers();
            }).error(function (err) {
                console.log('qrHunt.services.playerFactory.getLeaderboard: Unable to load leaderboard: ' + err.message);
            });
        };
        var resetPlayer = function () {
            $http.put(urlBase + '/' + uuid + '/reset')
                .success(function (p) {
                    player = p;
                    notifyObservers();
                }).error(function (err) {
                    console.log('qrHunt.services.playerFactory.getCurrentPlayer: Unable to load current player: ' + err.message);
                });
        };
        var addScan = function (id) {
            $http.put(urlBase + '/' + uuid + '/' + id)
                .success(function (p) {
                    player = p;
                    notifyObservers();
                }).error(function (err) {
                    console.log('qrHunt.services.playerFactory.getCurrentPlayer: Unable to load current player: ' + err.message);
                });
        };

        playerFactory.savePlayer = function (playerName) {
            if (player && player.uuid == uuid) {
                player.alias = playerName;
                $http.put(urlBase + '/' + uuid, player)
                    .success(function (p) {
                        playerFactory.reload();
                    }).error(function (err) {
                        console.log('qrHunt.services.playerFactory.updatePlayer: Unable to update current player: ' + err.message);
                    });
            }
        };

        playerFactory.reload = function () {
            getPlayer();
            getLeaderboard();
        };
        playerFactory.reload();
        playerFactory.reloadLeaderboard = function () {
            getLeaderboard();
        };

        playerFactory.getPlayer = function () {
            return player;
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

