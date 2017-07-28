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
        newProcess: function (p) {
            var novo = {};
            for (var i in p) {
                novo[i] = p[i];
            }
            return novo;
        },
        addProcess: function (p) {
            var num_frames = p.frames;
//            p.frames = 1;
            p.id = ++$scope.lastId;
//            for (var i = 0; i < num_frames; i++) {
            p.ativo = true;
            p.memoria_livre = false;
            p.eliminar = false;
            p.estado = 1;
            p.cor = cor_memoria[$scope.lastId % cor_memoria.length];
            $scope.memoria_principal.add(p);
//            }
            $scope.processes.push(p);
            $scope.CPU.addLista(p);
            $scope.funcProcessos.zeraProcess();
        },
        eliminarClick: function (p) {
            p.eliminar = true;
        },
    };
    $scope.funcProcessos.zeraProcess();
    $scope.memoria_principal = new Memoria(20);
    $scope.memoria_principal.add = function (p) {
        var numFrames = p.frames;
        var indexInsert = this.buscaEspacoVazio(numFrames);
        log("add");
        log(indexInsert);
        if (indexInsert !== false) {
            $scope.memoria_principal.size += numFrames;
            for (var i = 0; i < numFrames; i++) {
                var processo_memoria = new $scope.funcProcessos.newProcess(p);
//                    log(processo_memoria);
                processo_memoria.frames = 1;
                $scope.memoria_principal.processes[ indexInsert + i] = processo_memoria;
            }
        } else {
            //add secundaria
        }

//            log(this.shiftProcesso());
        return;
        if (p.memoria_livre) {
            $scope.memoria_principal.size += p.frames;
        }
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

    $scope.memoria_principal.init();

    $scope.memoria_secundaria = new Memoria(100);




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
        clock: 100,
        pop: function () {
//            log($scope.listaPrioridadeCPU);
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
                if (typeof ($scope.cpu) !== 'undefined' && !in_array($scope.memoria_principal.processes, $scope.cpu)) {//page fault e há processos na fila
                    log("Processo " + $scope.cpu.id + "Não encontrado na memoria principal");
                    var tamMemSoma = $scope.cpu.frames + $scope.memoria_principal.size;
                    if (tamMemSoma <= $scope.memoria_principal.size) {
                        log("Inserindo " + $scope.cpu.id + "na memoria principal");
                        $scope.memoria_principal.processes.push($scope.cpu);
                        $scope.memoria_principal.processes.size = tamMemSoma;
                    } else {
//                   update size
//                    var processo_p = $scope.memoria_principal.processes.shift();
                        var processo_p = $scope.memoria_principal.buscaPrimeiro();
                        log("Removendo " + processo_p.id + " da M.principal e inserindo na secundaria");
                        $scope.memoria_principal.size -= processo_p.frames;
                        $scope.memoria_secundaria.processes.push(processo_p);
                        $scope.memoria_secundaria.processes = $scope.memoria_secundaria.processes.filter(function (el) {
                            return  func_filtro(el, $scope.cpu);
                        });
                        log("Inserindo " + $scope.cpu.id + "na M.principal");
                        $scope.memoria_principal.add($scope.cpu);
//                        return;
                    }
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


    /*
     *      }).promise().done(function () {
     $scope.$apply();
     $scope.CPU.addLista($scope.cpu);
     $scope.runCPU();
     });
     */
});