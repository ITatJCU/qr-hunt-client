angular.module('qrHunt.mastermind', [
    'codes',
    'ui.router'
])
    .config(function config($stateProvider) {
        $stateProvider.state('mastermind', {
            url: '/mastermind',
            views: {
                "main": {
                    controller: 'MastermindCtrl',
                    templateUrl: 'mastermind/mastermind.tpl.html'
                }
            },
            data: { pageTitle: 'Mastermind' }
        });
    })

    .controller('MastermindCtrl', function MastermindController($scope, codeFactory) {

        $scope.selectedCode = {};

        $scope.setSelectedCode = function (selectedId) {
            codeFactory.getCode(selectedId, function (code) {
                $scope.selectedCode = code;
            });
        };

        $scope.saveCode = function () {
            if ($scope.selectedCode.title) {
                codeFactory.saveCode($scope.selectedCode);
                $scope.selectedCode = {};
            }
        };

        $scope.deleteCode = function () {
            if ($scope.selectedCode.id) {
                codeFactory.deleteCode($scope.selectedCode.id);
                $scope.selectedCode = {};
            }
        };
    });

