var memoria_secundaria = function ($scope) {
    return {
        size: 0,
        max_size: 100,
        processes: [],
        vazios: [{init: 0, len: 100}],
        remove_processo: function (p) {
            var indice = 0;
            for (var i in $scope.memoria_secundaria.processes) {
                if (typeof ($scope.memoria_secundaria.processes[i]) !== 'undefined' && $scope.memoria_secundaria.processes[i].id == p.id) {
                    $scope.memoria_secundaria.addVazio({init: parseInt(i), len: $scope.memoria_secundaria.processes[i].frames});
//                    $scope.memoria_secundaria.processes.splice(i, 1);
                    $scope.memoria_secundaria.processes[i] = {};

                    return true;
                }
            }
            return false;
        },
        page_fault: function (p) {
            var existeEspaco = $scope.memoria_principal.existeEspacoVazio(p.frames);

            while (existeEspaco === false) {
                var removed_process = $scope.memoria_principal.removeFifo();
                $scope.memoria_secundaria.add(removed_process);
                existeEspaco = $scope.memoria_principal.existeEspacoVazio(p.frames);
            }
            $scope.memoria_principal.add(p);

            $scope.memoria_secundaria.remove_processo(p);
//            
        },
        add: function (p) {
            var numFrames = p.frames;
            var insert = $scope.memoria_secundaria.getEspacoVazio(numFrames);
            if (insert !== false) {
                $scope.memoria_secundaria.processes[insert.init] = new $scope.funcProcessos.newProcess(p);
            } else {
                log("NÃO HÁ ESPAÇO NA MEMÓRIA SECUNDARIA PARA INSERIR " + p.id);
            }
        },
        removePrimeiro: function (tamanho) {
            var indice = 0;
            for (var i in $scope.memoria_secundaria.processes) {
                if (typeof ($scope.memoria_secundaria.processes[i]) !== 'undefined') {
                    $scope.memoria_secundaria.vazios.push({});
                    $scope.memoria_secundaria.processes[i] = {};//aqui
                }
            }
            return false;
        },
        addVazio: function (elem) {
            $scope.memoria_secundaria.vazios.push(elem);
            $scope.memoria_secundaria.vazios.sort(function (a, b) {
                return (a.init > b.init) ? 1 : ((b.init > a.init) ? -1 : 0);
            });
            $scope.memoria_secundaria.mergeEspacosVazios();

        },
        mergeEspacosVazios: function () {
            for (var i = 0; i < $scope.memoria_secundaria.vazios.length; i++) {
                if (existeKey($scope.memoria_secundaria.vazios[i + 1], 'init')) {
                    if (($scope.memoria_secundaria.vazios[i].init + $scope.memoria_secundaria.vazios[i].len) == $scope.memoria_secundaria.vazios[i + 1].init) {
                        $scope.memoria_secundaria.vazios[i].len += $scope.memoria_secundaria.vazios[i + 1].len;
                        $scope.memoria_secundaria.vazios.splice((i + 1), 1);
                        $scope.memoria_secundaria.mergeEspacosVazios();
                        break;
                    }
                }
            }
        },
        existeEspacoVazio: function (tamanho) {
            for (var i in $scope.memoria_secundaria.vazios) {
                if ($scope.memoria_secundaria.vazios[i].len >= tamanho) {
                    return true;
                }
            }
            return false;
        },
        getEspacoVazio: function (tamanho) {
            var indicevazio = 0;
            for (var i in $scope.memoria_secundaria.vazios) {
                if ($scope.memoria_secundaria.vazios[i].len >= tamanho) {
                    var retorno = {
                        init: $scope.memoria_secundaria.vazios[i].init,
                        len: tamanho
                    };
                    if ($scope.memoria_secundaria.vazios[i].len == tamanho) {//ocupou todo espaço vazio
                        $scope.memoria_secundaria.vazios.splice(i, 1);

                    } else {
                        $scope.memoria_secundaria.vazios[i] = {
                            init: $scope.memoria_secundaria.vazios[i].init + tamanho,
                            len: $scope.memoria_secundaria.vazios[i].len - tamanho
                        };
                    }
                    return retorno;
                }
            }
            return false;
        },
    }
}