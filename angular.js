var app = angular.module("appMemory", []);
function log(p, str) {
    if (str) {
        console.log(str);
    }
    if (typeof (p) == 'object') {
        console.log(p);
        var str = "";
        for (var i in p) {
            if (typeof (p[i]) == 'object') {
                str += i + "=>    ";
                for (var j in p[i]) {
                    str += (j + "-> ");
                    str += (p[i][j] + "; ");
                }
                str += "\n";
            } else {
                str += (i + "-> ");
                str += (p[i] + "; ");
                str += "\n";
            }
        }
        console.log(str + "\n");
    } else {
        console.log(p);
    }
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
//    $scope.memoria_principal.init();
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
    $scope.isRightUndefined = function (item) {
      
        if (typeof (item) === 'undefined') {
            return false;
        }
        if (typeof (item.id) === 'undefined') {
            return false;
        }
        return true;
    }
});