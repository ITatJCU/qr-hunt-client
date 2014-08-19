angular.module('qrHunt.tracker', [
    'btford.socket-io',
    'players',
    'ui.router'
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
    .controller('TrackerCtrl', function TrackerController($scope, liveSocket, playerFactory) {
        liveSocket.forward('newScan', $scope);

        $scope.$on('socket:newScan', function () {
            playerFactory.reloadLeaderboard();
        });
    });

