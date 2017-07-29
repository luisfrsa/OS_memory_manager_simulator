var app = angular.module("appMemory", []);
function log(p) {
    console.log(p);
}
app.controller("memoryCtrl", function ($scope) {
    $scope.lastId = 0;
    $scope.processes = [];
    $scope.ngRepeatNumber = function (n) {
        return new Array(n);
    };
    $scope.listaPrioridadeCPU = [[]];
    $scope.listaSuspendidos = [];
    $scope.funcProcessos = funcProcessos($scope);
    $scope.funcProcessos.zeraProcess();
//    $scope.memoria_principal = new Memoria(20);
    $scope.memoria_principal = memoria_principal($scope);
    $scope.memoria_principal.init();
    $scope.memoria_secundaria = memoria_secundaria($scope);



    $scope.eliminar = eliminar($scope);

    $scope.CPU = CPU($scope);
    $scope.CPU.run();


    /*
     *      }).promise().done(function () {
     $scope.$apply();
     $scope.CPU.addLista($scope.cpu);
     $scope.runCPU();
     });
     */
});