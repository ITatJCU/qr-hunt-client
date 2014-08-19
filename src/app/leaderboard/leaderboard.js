angular.module('qrHunt.leaderboard', [
    'ui.router'
])

    .config(function config($stateProvider) {
        $stateProvider.state('leaderboard', {
            url: '/leaderboard',
            views: {
                "main": {
                    controller: 'LeaderboardCtrl',
                    templateUrl: 'leaderboard/leaderboard.tpl.html'
                }
            },
            data: { pageTitle: 'Leaderboard' }
        });
    })

    .controller('LeaderboardCtrl', function LeaderboardController($scope) {
    })
;

