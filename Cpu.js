var CPU = function ($scope) {
    return {
        clock: 500,
//        pop: function () {
////            log($scope.listaPrioridadeCPU);
//            for (var i = $scope.listaPrioridadeCPU.length - 1; i >= 0; i--) {
//                if ($scope.listaPrioridadeCPU[i].length > 0) {
//                    var ret = $scope.listaPrioridadeCPU[i].shift();
//                    return ret;
//                }
//            }
//        },
        run: function () {
            setTimeout(function () {
                $scope.cpu_process = $scope.CPU.escalonamento[$scope.escalonamento].get();
                $scope.$apply();
                $('#execucao .bar').animate({'width': '100%'}, $scope.CPU.clock, function () {
                    $('#execucao .bar').css({'width': '0'});
                    if (typeof ($scope.cpu_process) !== 'undefined') {
                        if (in_array($scope.memoria_principal.processes, $scope.cpu_process)) {
                            log("Encontrado na Memoria Principal ID: " + $scope.cpu_process.id);
                        } else {
                            log("Não encontrado na memoria principal (page fault) ID: " + $scope.cpu_process.id);
                            if (in_array($scope.memoria_secundaria.processes, $scope.cpu_process)) {
                                log("Encontrado na memoria _Secundaria ID: " + $scope.cpu_process.id);
                                $scope.memoria_secundaria.page_fault($scope.cpu_process);
                            } else {
                                log("Não encontrado na secundaria, portanto esta sendo inicializado ID: " + $scope.cpu_process.id);
                                var espacoVazio = $scope.memoria_principal.existeEspacoVazio($scope.cpu_process.frames);
                                if (espacoVazio !== false) {//ha espaco na mem principal
                                    log("Inserindo na memoria principal ID: " + $scope.cpu_process.id);
                                    $scope.memoria_principal.add($scope.cpu_process, espacoVazio);
                                } else {
                                    log("Não há espeço na memoria principal, Inserindo na memoria secundaria ID: " + $scope.cpu_process.id);
                                    $scope.memoria_secundaria.add($scope.cpu_process);
                                }
                            }
                        }

                        if ($scope.cpu_process.ativo === true) {
                            $scope.CPU.escalonamento[$scope.escalonamento].add($scope.cpu_process);
                        } else {
                            $scope.listaSuspendidos.push($scope.cpu_process);
                        }
                        if ($scope.cpu_process.eliminar === true) {
                            $scope.eliminar($scope.cpu_process);
                        }
                    } else {
                        log("Não há processos para serem executados pela CPU");
                    }
//                    $scope.$apply();
                    $scope.CPU.run();
                });
            }, $scope.CPU.clock);
        },
        escalonamento: {
            get_maior_prioridade: function () {
                for (var i = $scope.listaPrioridadeCPU.length - 1; i >= 0; i--) {
                    if ($scope.listaPrioridadeCPU[i].length > 0) {
                        return i;
                    }
                }
            },
            get_menor_fifo: function (index_prioridade) {
                var menor = null;
                var index = null;
                var lista = $scope.listaPrioridadeCPU[index_prioridade];
                for (var i = 0; i < lista.length; i++) {
                    if (menor == null || lista[i].fifo < menor) {
                        menor = lista[i].fifo;
                        index = i;
                    }
                }
                var process = lista[index];
                log(process.fifo, "Menor fifo");
                $scope.listaPrioridadeCPU[index_prioridade].splice(index, 1);
                return process;
            },
            round_robin: {
                get: function () {
                    var index_prioridade = $scope.CPU.escalonamento.get_maior_prioridade();
                    if (typeof (index_prioridade) !== 'undefined') {
                        return $scope.CPU.escalonamento.get_menor_fifo(index_prioridade);
                    }
                    return;
                },
                add: function (process) {
                    process.fifo = ++$scope.fifo;
                    var type = typeof ($scope.listaPrioridadeCPU[process.prioridade]);
                    if (type === 'undefined') {
                        $scope.listaPrioridadeCPU[process.prioridade] = [];
                    }
                    $scope.listaPrioridadeCPU[process.prioridade].push(process);
                },
            },
        },
    };
}