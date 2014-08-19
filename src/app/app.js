angular.module('qrHunt', [
    'btford.socket-io',
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
        url: 'http://127.0.0.1:8080'
    })

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })

    .run(function run() {
    })
    .factory('liveSocket', function (socketFactory, SERVER_CONFIG) {
        var myIoSocket = io.connect(SERVER_CONFIG.url);

        var mySocket = socketFactory({ioSocket: myIoSocket});
        mySocket.forward('newScan');
        return mySocket;
    })
    .controller('AppCtrl', function AppCtrl($scope, $location, playerFactory, codeFactory) {
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

        $scope.savePlayer = function (playerName) {
            playerFactory.savePlayer(playerName);
        };

        var updatePlayerProgress = function () {
            if ($scope.player && $scope.player.scans && $scope.player.scans.length && $scope.gameCodes.length) {
                $scope.progress = (($scope.player.scans.length + 0.0) / $scope.gameCodes.length) * 100;
            } else if ($scope.player && $scope.player.scans.length === 0) {
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

