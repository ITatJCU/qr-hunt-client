angular.module('qrHunt', [
    'templates-app',
    'templates-common',
    'qrHunt.home',
    'qrHunt.about',
    'qrHunt.mastermind',
    'qrHunt.scan',
    'ui.router',
    'players',
    'codes'
])

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })

    .run(function run() {
    })

    .controller('AppCtrl', function AppCtrl($scope, $location, playerFactory, codeFactory) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | qrHunt';
            }
        });

        $scope.leaderboard = [];

        $scope.players = [];
        $scope.player = {};
        $scope.codes = [];
        $scope.gameCodes = [];

        $scope.progress = 0.0;

        var updatePlayerProgress = function () {
            if ($scope.player && $scope.player.scans && $scope.player.scans.length && $scope.gameCodes.length) {
                $scope.progress = (($scope.player.scans.length + 0.0) / $scope.gameCodes.length) * 100;
            }
        };

        var updatePlayers = function () {
            $scope.players = playerFactory.getPlayers();
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

