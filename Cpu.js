var CPU = function ($scope) {
    return {
        clock: 300,
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
                    log("Processo " + $scope.cpu.id + " Não encontrado na memoria principal");
                    var espacoVazio = $scope.memoria_principal.existeEspacoVazio($scope.cpu.frames);
                    if (espacoVazio !== false) {
                        log("Inserindo " + $scope.cpu.id + " na memoria principal");
                        $scope.memoria_principal.add($scope.cpu);
//                        $scope.memoria_principal.processes.push($scope.cpu);
//                        $scope.memoria_principal.processes.size = tamMemSoma;
                    } else {
                        log("Nao cabe na memoria principal" + $scope.cpu.id);
//                        $scope.memoria_principal.add($scope.cpu);
                        if (false) {
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
}