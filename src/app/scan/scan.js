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
            playerFactory.reload();
        };
    })

    .controller('ScannedCtrl', function ScannedController($scope, $stateParams, codeFactory, playerFactory) {
        $scope.foundCode = null;

        var setFound = function (code) {
            $scope.foundCode = code;
            if (code != null) {
                playerFactory.scanned(code.id);
                playerFactory.reload();
            }
        };
        if ($scope.foundCode == null) {
            codeFactory.getCode($stateParams.codeId, function (result) {
                setFound(result);
            });
        }
        codeFactory.addObserver(function () {
            if ($scope.foundCode == null) {
                codeFactory.getCode($stateParams.codeId, function (result) {
                    setFound(result);
                });
            }
        });

    })
;

