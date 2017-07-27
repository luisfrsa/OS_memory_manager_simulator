var app = angular.module("appMemory", []);
function log(p) {
    console.log(p);
}
app.controller("memoryCtrl", function ($scope) {
    $scope.lastId = 0;
    $scope.processes = [];

    $scope.funcProcessos = {
        zeraProcess: function () {
            $scope.process = {
                tipo: "CPU",
                frames: 5,
                prioridade: 0,
            };
        },
        suspender_retomar: function (p) {
            p.ativo = !p.ativo;
            if (p.ativo === true) {
                $scope.CPU.addLista(p);
                $scope.listaSuspendidos = $scope.listaSuspendidos.filter(function (el) {
                    return func_filtro(el, p);
                    ;
                });
            }
        },
        addProcess: function (p) {
            p.id = ++$scope.lastId;
            p.ativo = true;
            p.memoria_livre = false;
            p.eliminar = false;
            p.estado = 1;
            p.cor = cor_memoria[$scope.lastId % cor_memoria.length];
            $scope.processes.push(p);
            $scope.memoria_principal.add(p);
            $scope.CPU.addLista(p);
            $scope.funcProcessos.zeraProcess();
        },
        eliminarClick: function (p) {
            p.eliminar = true;
        },
    };
    $scope.funcProcessos.zeraProcess();
    $scope.memoria_principal = {
        size: 0,
        max_size: 20,
        processes: [],
        add: function (p) {
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
        }
    };
    $scope.memoria_secundaria = {
        size: 0,
        max_size: 1000,
        processes: [],
    };
    $scope.listaPrioridadeCPU = [[]];
    $scope.listaSuspendidos = [];


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

    $scope.CPU = {
        clock: 200,
        pop: function () {
            log($scope.listaPrioridadeCPU);
            for (var i = $scope.listaPrioridadeCPU.length - 1; i >= 0; i--) {
                if ($scope.listaPrioridadeCPU[i].length > 0) {
                    var ret = $scope.listaPrioridadeCPU[i].shift();
                    return ret;
                }
            }
        },
        addLista: addListaCPU = function (process) {
            var type = typeof ($scope.listaPrioridadeCPU[process.prioridade]);
            if (type === 'undefined') {
                $scope.listaPrioridadeCPU[process.prioridade] = [];
            }
            $scope.listaPrioridadeCPU[process.prioridade].push(process);
        },
        run: function () {
            setTimeout(function () {
                $scope.cpu = $scope.CPU.pop();
                if (!in_array($scope.memoria_principal.processes, $scope.cpu) && typeof ($scope.cpu) !== 'undefined') {//page fault
//                var tamMemSoma =$scope.cpu.frames + $scope.memoria_principal.size;
//                if (!in_array($scope.memoria_principal.processes, $scope.cpu) && tamMemSoma <= $scope.memoria_principal.size) {
//                    $scope.memoria_principal.processes.push($scope.cpu);
//                    $scope.memoria_principal.processes.size = tamMemSoma;
//
//                } else {
//                   update size
                    var processo_p = $scope.memoria_principal.processes.shift();
                    $scope.memoria_secundaria.processes.push(processo_p);
                    $scope.memoria_secundaria.processes = $scope.memoria_secundaria.processes.filter(function (el) {
                        return  func_filtro(el, $scope.cpu);
                    });
                    $scope.memoria_principal.processes.push($scope.cpu);
//                }
                }
                $('#execucao .bar').animate({'width': '100%'}, $scope.CPU.clock, function () {
                    $('#execucao .bar').css({'width': '0'});
                    $scope.$apply();
                    if (typeof ($scope.cpu) !== 'undefined') {
                        if ($scope.cpu.ativo === true) {
                            $scope.CPU.addLista($scope.cpu);
                        } else {
                            $scope.listaSuspendidos.push($scope.cpu);
                        }
                        if ($scope.cpu.eliminar === true) {
                            $scope.eliminar($scope.cpu);
                        }

                    }
                    $scope.CPU.run();
                });

            }, $scope.CPU.clock);
        }
    };
    $scope.CPU.run();

    $scope.ngRepeatNumber = function (n) {
        return new Array(n);
    };
    /*
     *      }).promise().done(function () {
     $scope.$apply();
     $scope.CPU.addLista($scope.cpu);
     $scope.runCPU();
     });
     */
});