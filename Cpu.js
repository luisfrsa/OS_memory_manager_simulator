var CPU = function ($scope) {
    return {
        clock: 500,
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
                        if ($scope.cpu_process.fifo == 0) {//"IO
                            $scope.funcProcessos.addIO($scope.cpu_process);
                        } else if ($scope.cpu_process.ativo === true) {
                            $scope.CPU.escalonamento.add($scope.cpu_process);
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
            add: function (process) {
                if (process.new && process.tipo == 'IO') {
                    process.fifo = 0;
                } else {
                    process.fifo = ++$scope.fifo;
                }
                process.new = false;
                if (process.tipo == 'IO' && process.fifo !== 0) {
                    process.new = (Math.floor(Math.random() * 10) < 2);
                }
                $scope.CPU.escalonamento[$scope.escalonamento].add(process);
            },
            get_maior_prioridade: function () {
                for (var i = $scope.listaPrioridadeCPU.length - 1; i >= 0; i--) {
                    if ($scope.listaPrioridadeCPU[i].length > 0) {
                        return i;
                    }
                }
            },
            get_loteria: function () {
                var loteria = [];
                var total = 0;
                log($scope.listaPrioridadeCPU," $scope.listaPrioridadeCPU");
                for (var i = 0; i < $scope.listaPrioridadeCPU.length; i++) {
                    log(i);
                    if (typeof ($scope.listaPrioridadeCPU[i]) != 'undefined' && $scope.listaPrioridadeCPU[i].length > 0) {//caso existam processos com esta prioridade;
                        for (var j = 0; j < (i + 1); j++) {//0-> 1, 1->4, 2->9
                            loteria.push(i);
                        }
                    }
                }
                var randomLoteria = Math.floor(Math.random() * loteria.length);
                var randomPrioridade = loteria[randomLoteria];
                var randomProcesso = Math.floor(Math.random() * $scope.listaPrioridadeCPU[randomPrioridade].length);
                var processo = $scope.listaPrioridadeCPU[randomPrioridade][randomProcesso];
                $scope.listaPrioridadeCPU[randomPrioridade].splice(randomProcesso, 1);
                return processo;
            },
            get_menor_fifo: {
                padrao: function () {
                    var menor = null;
                    var index = null;
                    var index_prioridade;
                    for (var j in $scope.listaPrioridadeCPU) {
                        var lista = $scope.listaPrioridadeCPU[j];
                        for (var i = 0; i < lista.length; i++) {
                            if (menor == null || lista[i].fifo < menor) {
                                menor = lista[i].fifo;
                                index = i;
                                index_prioridade = j;
                            }
                        }
                    }
                    if (index !== null) {
                        var process = $scope.listaPrioridadeCPU[index_prioridade][index];
                        $scope.listaPrioridadeCPU[index_prioridade].splice(index, 1);
                        return process;
                    }
                    return;
                },
                prioridade: function (index_prioridade) {
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
                    $scope.listaPrioridadeCPU[index_prioridade].splice(index, 1);
                    return process;
                }
            },
            round_robin: {
                get: function () {
                    var process = $scope.CPU.escalonamento.get_menor_fifo.padrao();
                    if (typeof (process) !== 'undefined') {
                        return process;
                    }
                    return;
                },
                add: function (process) {
                    var type = typeof ($scope.listaPrioridadeCPU[process.prioridade]);
                    if (type === 'undefined') {
                        $scope.listaPrioridadeCPU[process.prioridade] = [];
                    }
                    $scope.listaPrioridadeCPU[process.prioridade].push(process);
                },
            },
            round_robin_prioridade: {
                get: function () {
                    var index_prioridade = $scope.CPU.escalonamento.get_maior_prioridade();
                    if (typeof (index_prioridade) !== 'undefined') {
                        return $scope.CPU.escalonamento.get_menor_fifo.prioridade(index_prioridade);
                    }
                    return;
                },
                add: function (process) {
                    var type = typeof ($scope.listaPrioridadeCPU[process.prioridade]);
                    if (type === 'undefined') {
                        $scope.listaPrioridadeCPU[process.prioridade] = [];
                    }
                    $scope.listaPrioridadeCPU[process.prioridade].push(process);
                },
            },
            com_prioridade: {
                get: function () {
                    var index_prioridade = $scope.CPU.escalonamento.get_maior_prioridade();
                    if (typeof (index_prioridade) !== 'undefined') {
                        var process_retorno = $scope.CPU.escalonamento.get_menor_fifo.prioridade(index_prioridade);
                        for (var i = $scope.listaPrioridadeCPU.length; i > 0; i--) {
                            if (typeof ($scope.listaPrioridadeCPU[i]) == 'undefined') {
                                $scope.listaPrioridadeCPU[i] = [];
                            }
                            if (typeof ($scope.listaPrioridadeCPU[i - 1]) == 'undefined') {
                                $scope.listaPrioridadeCPU[i - 1] = [];
                            }
                            $scope.listaPrioridadeCPU[i] = $scope.listaPrioridadeCPU[i - 1];
                        }
                        $scope.listaPrioridadeCPU[0] = [];
                        return process_retorno;
                    }
                    return;
                },
                add: function (process) {
                    var type = typeof ($scope.listaPrioridadeCPU[process.prioridade]);
                    if (type === 'undefined') {
                        $scope.listaPrioridadeCPU[process.prioridade] = [];
                    }
                    $scope.listaPrioridadeCPU[process.prioridade].push(process);
                },
            },
            com_prioridade_dinamica: {
                get: function () {
                    var index_prioridade = $scope.CPU.escalonamento.get_maior_prioridade();
                    if (typeof (index_prioridade) !== 'undefined') {
                        var process_retorno = $scope.CPU.escalonamento.get_menor_fifo.prioridade(index_prioridade);
                        for (var i = $scope.listaPrioridadeCPU.length; i > 0; i--) {
                            if (typeof ($scope.listaPrioridadeCPU[i]) == 'undefined') {
                                $scope.listaPrioridadeCPU[i] = [];
                            }
                            if (typeof ($scope.listaPrioridadeCPU[i - 1]) == 'undefined') {
                                $scope.listaPrioridadeCPU[i - 1] = [];
                            }
                            $scope.listaPrioridadeCPU[i] = $scope.listaPrioridadeCPU[i - 1];
                        }
                        $scope.listaPrioridadeCPU[0] = [];
                        return process_retorno;
                    }
                    return;
                },
                add: function (process) {
                    var type = typeof ($scope.listaPrioridadeCPU[process.prioridade]);
                    if (type === 'undefined') {
                        $scope.listaPrioridadeCPU[process.prioridade] = [];
                    }
                    $scope.listaPrioridadeCPU[process.prioridade].push(process);
                },
            },
            loteria: {
                get: function () {
                    var index_prioridade = $scope.CPU.escalonamento.get_maior_prioridade();
                    if (typeof (index_prioridade) !== 'undefined') {
                        return $scope.CPU.escalonamento.get_loteria();

                    }
                    return;
                },
                add: function (process) {
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