angular.module('qrHunt.tracker', [
    'btford.socket-io',
    'players',
    'ui.router',
    'urish.load'
])
    .config(function config($stateProvider) {
        $stateProvider.state('tracker', {
            url: '/tracker',
            views: {
                "main": {
                    controller: 'TrackerCtrl',
                    templateUrl: 'tracker/tracker.tpl.html'
                }
            },
            data: { pageTitle: 'Live Leaderboard' }
        });
    })
    .controller('TrackerCtrl', function TrackerController($scope, angularLoad, SERVER_CONFIG, playerFactory, socketFactory) {

        angularLoad.loadScript('https://cdn.socket.io/socket.io-1.0.6.js').then(function () {
            var myIoSocket = io.connect(SERVER_CONFIG.url);

            var mySocket = socketFactory({ioSocket: myIoSocket});
            mySocket.forward('newScan');

            $scope.$on('socket:newScan', function () {
                playerFactory.reloadLeaderboard();
            });
        });


    });

