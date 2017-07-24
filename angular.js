var app = angular.module("appMemory", []);
function log(p) {
    console.log(p);
}
app.controller("memoryCtrl", function ($scope) {
    $scope.lastId = 0;
    $scope.process = {
        tipo: "CPU",
        frames: 5,
        prioridade: 0,
    };
    $scope.cpu = {};
    $scope.memoria_principal = {
        size: 0,
        max_size: 20,
        processes: [],
    };
    $scope.memoria_secundaria = {
        size: 0,
        max_size: 1000,
        processes: [],
    };
    $scope.processes = [];
    $scope.listaPrioridadeCPU = [[]];
    $scope.listaSuspendidos = [];

    $scope.zeraProcess = function () {
        $scope.process = {
            tipo: "CPU",
            frames: 5,
            prioridade: 0,
        };
    };

    $scope.suspender_retomar = function (p) {
        p.ativo = !p.ativo;
        if (p.ativo === true) {
            $scope.addListaCPU(p);
            $scope.listaSuspendidos = $scope.listaSuspendidos.filter(function (el) {
                return func_filtro(el, p);
                ;
            });
        }
    };

    $scope.eliminarClick = function (p) {
        p.eliminar = true;
    };
    $scope.eliminar = function (p) {
        $scope.processes = $scope.processes.filter(function (el) {
            return func_filtro(el, p);
            ;
        });
        if (in_array($scope.memoria_principal.processes, p)) {
            $scope.memoria_principal.size -= p.frames;
            $scope.memoria_principal.processes = $scope.memoria_principal.processes.filter(function (el) {
                return func_filtro(el, p);
                ;
            });
        }
        if (in_array($scope.memoria_secundaria.processes, p)) {
            $scope.memoria_secundaria.size -= p.frames;
            $scope.memoria_secundaria.processes = $scope.memoria_secundaria.processes.filter(function (el) {
                return func_filtro(el, p);
                ;
            });
        }
        $scope.listaPrioridadeCPU = $scope.listaPrioridadeCPU.map(function (el) {
            return el.filter(function (e) {
                return  func_filtro(e, p);
            });
        });
    };

    $scope.ngRepeatNumber = function (n) {
        return new Array(n);
    };
    $scope.addProcessMemory = function (p) {
        var novoTam = $scope.memoria_principal.size += p.frames;
        if (novoTam <= $scope.memoria_principal.max_size) {
            $scope.memoria_principal.size = novoTam;
            $scope.memoria_principal.processes.push(p);
        } else {
            var novoTamSec = $scope.memoria_secundaria.size += p.frames;
            if (novoTam <= $scope.memoria_secundaria.max_size) {
                $scope.memoria_secundaria.size = novoTam;
                $scope.memoria_secundaria.processes.push(p);
            }
        }
    };

    $scope.getListaCPU = function () {
        log($scope.listaPrioridadeCPU);
        for (var i = $scope.listaPrioridadeCPU.length - 1; i >= 0; i--) {
            if ($scope.listaPrioridadeCPU[i].length > 0) {
                var ret = $scope.listaPrioridadeCPU[i].shift();
                return ret;
            }
        }
    };
    $scope.addListaCPU = function (process) {
        var type = typeof ($scope.listaPrioridadeCPU[process.prioridade]);
        if (type === 'undefined') {
            $scope.listaPrioridadeCPU[process.prioridade] = [];
        }
        $scope.listaPrioridadeCPU[process.prioridade].push(process);
    };

    $scope.addProcess = function (p) {
        log(p);
        p.id = ++$scope.lastId;
        p.ativo = true;
        p.eliminar = false;
        p.estado = 1;
        p.cor = cor_memoria[$scope.lastId % cor_memoria.length];
        $scope.processes.push(p);
        $scope.addProcessMemory(p);
        $scope.addListaCPU(p);
        $scope.zeraProcess();
    };

//    $scope.addProcess({estado: 1, frames: 5, prioridade: 0, tipo: "IO"});
//    $scope.addProcess({estado: 2, frames: 5, prioridade: 0, tipo: "CPU"});


    $scope.clockCPU = 300;
    $scope.runCPU = function () {
        setTimeout(function () {
            $scope.cpu = $scope.getListaCPU();
            if (!in_array($scope.memoria_principal.processes, $scope.cpu) && typeof ($scope.cpu) !== 'undefined') {//page fault
                var processo_p = $scope.memoria_principal.processes.shift();
                log('a');
                $scope.memoria_secundaria.processes.push(processo_p);
                log('b');
                $scope.memoria_secundaria.processes = $scope.memoria_secundaria.processes.filter(function (el) {
                    return  func_filtro(el, $scope.cpu);
                });
                log('c');
                $scope.memoria_principal.processes.push($scope.cpu);
            }
            $('#execucao .bar').animate({'width': '100%'}, $scope.clockCPU, function () {
                $('#execucao .bar').css({'width': '0'});
                $scope.$apply();
                if (typeof ($scope.cpu) !== 'undefined') {
                    if ($scope.cpu.ativo === true) {
                        $scope.addListaCPU($scope.cpu);
                    } else {
                        $scope.listaSuspendidos.push($scope.cpu);
                    }
                    if ($scope.cpu.eliminar === true) {
                        $scope.eliminar($scope.cpu);
                    }

                }
                $scope.runCPU();
            });

        }, $scope.clockCPU);
    };
    $scope.runCPU();
    /*
     *      }).promise().done(function () {
     $scope.$apply();
     $scope.addListaCPU($scope.cpu);
     $scope.runCPU();
     });
     */
});