angular.module('qrHunt.scan', [
    'players',
    'codes',
    'ui.router'
])

    .config(function config($stateProvider) {
        $stateProvider.state('scan', {
            url: '/scan',
            views: {
                "main": {
                    controller: 'ScanCtrl',
                    templateUrl: 'scan/scan.tpl.html'
                }
            },
            data: { pageTitle: 'Your Scans' }
        });

        $stateProvider.state('scanned', {
            url: '/scan/:codeId',
            views: {
                "main": {
                    controller: 'ScannedCtrl',
                    templateUrl: 'scan/scanned.tpl.html'
                }
            },
            data: { pageTitle: 'Scanned' }
        });
    })
    .controller('ScanCtrl', function ScanController($scope, playerFactory) {
        $scope.reset = function () {
            playerFactory.resetPlayer();
        };
    })

    .controller('ScannedCtrl', function ScannedController($scope, $stateParams, codeFactory, playerFactory) {
        $scope.foundCode = null;
        $scope.findAttempted = false;


        var setFound = function (code) {
            if (code != null) {
                playerFactory.scanned(code.id);
                $scope.foundCode = code;
            }
            $scope.findAttempted = true;
        };

        if ($scope.codes.length === 0) {
            codeFactory.addObserver(function () {
                if ($scope.foundCode == null) {
                    codeFactory.getCode($stateParams.codeId, function (result) {
                        setFound(result);
                    });
                }
            });
        } else if ($scope.foundCode == null && $scope.codes.length) {
            codeFactory.getCode($stateParams.codeId, function (result) {
                setFound(result);
            });
        }

    })
;

