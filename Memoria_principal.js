var memoria_principal = function ($scope) {
    return {
        size: 0,
        max_size: 20,
        processes: [],
        vazios: [{init: 0, len: 20}],
        init: function () {
            for (var i = 0; i < $scope.memoria_principal.max_size; i++) {
                $scope.memoria_principal.processes.push({
                    id: -1,
                    frames: 1,
                    memoria_livre: true,
                    cor: 'vazio',
                });
            }
//            $scope.memoria_principal.vazios.push({init: 0, len: 20, end: 20});
        },
        add: function (p) {
            var insert = $scope.memoria_principal.getEspacoVazio(p.frames);
            if (insert !== false) {//como ja foi verificado em CPU que há espaço, não é necessario tratar o else
                $scope.memoria_principal.processes[insert.init] = new $scope.funcProcessos.newProcess(p);
            }
        },
        removeFifo: function () {
            var index = null;
            var menor = null;
            for (var i in $scope.memoria_principal.processes) {
                if (typeof ($scope.memoria_principal.processes[i]) !== 'undefined') {
                    if (menor == null || $scope.memoria_principal.processes[i].fifo < menor) {
                        menor = $scope.memoria_principal.processes[i].fifo;
                        index = i;
                    }

                }
            }
            var removed_process = $scope.memoria_principal.processes[index];
            $scope.memoria_principal.addVazio({init: parseInt(index), len: $scope.memoria_principal.processes[index].frames});
            $scope.memoria_principal.processes[index] = {};
            return removed_process;
        },
        removePrimeiro: function () {//substituido pelo fifo
            var indice = 0;
            for (var i in $scope.memoria_principal.processes) {
                if (typeof ($scope.memoria_principal.processes[i]) !== 'undefined') {
                    var removed_process = $scope.memoria_principal.processes[i];
                    $scope.memoria_principal.addVazio({init: parseInt(i), len: $scope.memoria_principal.processes[i].frames});
                    $scope.memoria_principal.processes[i] = {};
                    return removed_process;
                }
            }
            return false;
        },
        addVazio: function (elem) {
            $scope.memoria_principal.vazios.push(elem);
            $scope.memoria_principal.vazios.sort(function (a, b) {
                return (a.init > b.init) ? 1 : ((b.init > a.init) ? -1 : 0);
            });
            $scope.memoria_principal.mergeEspacosVazios();
        },
        mergeEspacosVazios: function () {
            for (var i = 0; i < $scope.memoria_principal.vazios.length; i++) {
                if (existeKey($scope.memoria_principal.vazios[i + 1], 'init')) {
                    if (($scope.memoria_principal.vazios[i].init + $scope.memoria_principal.vazios[i].len) == $scope.memoria_principal.vazios[i + 1].init) {
                        $scope.memoria_principal.vazios[i].len += $scope.memoria_principal.vazios[i + 1].len;
                        $scope.memoria_principal.vazios.splice((i + 1), 1);
                        $scope.memoria_principal.mergeEspacosVazios();
                        break;
                    }
                }
            }
        },
        existeEspacoVazio: function (tamanho) {
            for (var i in $scope.memoria_principal.vazios) {
                if ($scope.memoria_principal.vazios[i].len >= tamanho) {
                    return true;
                }
            }
            return false;
        },
        getEspacoVazio: function (tamanho) {
            var indicevazio = 0;
            for (var i in $scope.memoria_principal.vazios) {
                if ($scope.memoria_principal.vazios[i].len >= tamanho) {
                    var retorno = {
                        init: $scope.memoria_principal.vazios[i].init,
                        len: tamanho
                    };
                    if ($scope.memoria_principal.vazios[i].len == tamanho) {//ocupou todo espaço vazio
                        $scope.memoria_principal.vazios.splice(i, 1);
                    } else {
                        $scope.memoria_principal.vazios[i] = {
                            init: $scope.memoria_principal.vazios[i].init + tamanho,
                            len: $scope.memoria_principal.vazios[i].len - tamanho
                        };
                    }
                    return retorno;
                }
            }
            return false;

            if (($scope.memoria_principal.size + tamanho) <= $scope.memoria_principal.max_size) {
                for (var indice_memoria = 0; indice_memoria < $scope.memoria_principal.max_size; indice_memoria++) {
                    if ($scope.memoria_principal.processes[indice_memoria].memoria_livre === true) {
                        indicevazio++;
                        if (indicevazio >= tamanho) {
                            return (indice_memoria - tamanho + 1);
                        }
                    } else {
                        indicevazio = 0;
                    }
                }
            }
            return false;
        },
    }
}