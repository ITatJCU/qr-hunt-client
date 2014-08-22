angular.module('qrHunt', [
    'templates-app',
    'templates-common',
    'ngAnimate',
    'qrHunt.home',
    'qrHunt.about',
    'qrHunt.mastermind',
    'qrHunt.scan',
    'qrHunt.leaderboard',
    'qrHunt.tracker',
    'ui.router',
    'players',
    'codes'
])
    .constant('SERVER_CONFIG', {
        url: 'http://cadcoder.ddns.net:9999'
    })

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })

    .run(function run() {

    })
    .controller('AppCtrl', function AppCtrl($scope, $location, playerFactory, codeFactory, $interval) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | qrHunt';
            }
        });

        $scope.leaderboard = [];
        $scope.player = {};
        $scope.codes = [];
        $scope.gameCodes = [];
        $scope.progress = 0.0;

        $scope.minutesTillNextDraw = 60 - new Date().getMinutes();

        var updateDrawTime = function () {
            $scope.minutesTillNextDraw--;
            if ($scope.minutesTillNextDraw < 0) {
                $scope.minutesTillNextDraw = 60;
            }
        };
        $interval(updateDrawTime, 60000, 0, false);

        $scope.savePlayer = function (playerName) {
            playerFactory.savePlayer(playerName);
        };

        var updatePlayerProgress = function () {
            if ($scope.player && $scope.player.scans && $scope.player.scans.length && $scope.gameCodes.length) {
                $scope.progress = (($scope.player.scans.length + 0.0) / $scope.gameCodes.length) * 100;
                $scope.progress = $scope.progress.toFixed(2);

            } else if ($scope.player && (!$scope.player.scans || $scope.player.scans.length === 0)) {
                $scope.progress = 0.0;
            }
        };

        var updatePlayers = function () {
            $scope.player = playerFactory.getPlayer();
            $scope.leaderboard = playerFactory.getLeaderboard();
            updatePlayerProgress();
        };
        var updateCodes = function () {
            $scope.codes = codeFactory.getCodes();
            $scope.gameCodes = codeFactory.getGameCodes();
            updatePlayerProgress();
        };

        playerFactory.addObserver(updatePlayers);
        updatePlayers();

        codeFactory.addObserver(updateCodes);
        updateCodes();
    });

