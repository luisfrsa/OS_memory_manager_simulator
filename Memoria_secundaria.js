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
//            log("INIT page fault ID: " + p.id);
//            log($scope.memoria_principal.processes);
//            log($scope.memoria_secundaria.processes);
//            al("INIT page fault ID: " + p.id);
            var existeEspaco = $scope.memoria_principal.existeEspacoVazio(p.frames);

            while (existeEspaco === false) {
                var removed_process = $scope.memoria_principal.removeFifo();
//                log("removendo memoria principal ID: " + removed_process.id);
//                log($scope.memoria_principal.processes);
//                log($scope.memoria_secundaria.processes);
//                al("removendo memoria principal ID: " + removed_process.id);

                $scope.memoria_secundaria.add(removed_process);
//                log("add memoria secundaria ID: " + removed_process.id);
//                log($scope.memoria_principal.processes);
//                log($scope.memoria_secundaria.processes);
//                al("add memoria secundaria ID: " + removed_process.id);

//                log("verifica espaco existente: " + existeEspaco);
//                log($scope.memoria_principal.processes);
//                log($scope.memoria_secundaria.processes);
                existeEspaco = $scope.memoria_principal.existeEspacoVazio(p.frames);
//                al("verifica espaco existente: " + existeEspaco);
            }
            $scope.memoria_principal.add(p);
//            log("adicionando memoria principal ID: " + removed_process.id);
//            log($scope.memoria_principal.processes);
//            log($scope.memoria_secundaria.processes);
//            al("adicionando memoria principal ID: " + removed_process.id);

            $scope.memoria_secundaria.remove_processo(p);

//            log("removendo memoria secundaria ID: " + removed_process.id);
//            log($scope.memoria_principal.processes);
//            log($scope.memoria_secundaria.processes);
//            al("removendo memoria secundaria ID: " + removed_process.id);
//            al("END page fault ID: " + p.id);
//            
        },
        add: function (p) {
            var numFrames = p.frames;
            var insert = $scope.memoria_secundaria.getEspacoVazio(numFrames);
            if (insert !== false) {
                $scope.memoria_secundaria.processes[insert.init] = new $scope.funcProcessos.newProcess(p);
            } else {
                log("NÃO HÁ ESPAÇO NA MEMÓRIA SECUNDARIA PARA INSERIR " + p.id);
//                $scope.memoria_secundaria.removeFifo(numFrames);
            }
        },
        removePrimeiro: function (tamanho) {
            var indice = 0;
            for (var i in $scope.memoria_secundaria.processes) {
                if (typeof ($scope.memoria_secundaria.processes[i]) !== 'undefined') {
                    $scope.memoria_secundaria.vazios.push({});
//                    $scope.memoria_secundaria.processes.splice(i, 1);
                    $scope.memoria_secundaria.processes[i] = {};//aqui
                }
            }
            return false;
        },
        addVazio: function (elem) {
//            log($scope.memoria_secundaria.vazios, "vazios antes add");
            $scope.memoria_secundaria.vazios.push(elem);
            $scope.memoria_secundaria.vazios.sort(function (a, b) {
                return (a.init > b.init) ? 1 : ((b.init > a.init) ? -1 : 0);
            });
//            log($scope.memoria_secundaria.vazios, "vazios apos add");
            $scope.memoria_secundaria.mergeEspacosVazios();

        },
        mergeEspacosVazios: function () {
            for (var i = 0; i < $scope.memoria_secundaria.vazios.length; i++) {
//                if (typeof ($scope.memoria_secundaria.vazios[i + 1] !== 'undefined') && typeof ($scope.memoria_secundaria.vazios[i + 1].init) !== 'undefined') {
                if (existeKey($scope.memoria_secundaria.vazios[i + 1], 'init')) {
//                    log(typeof ($scope.memoria_secundaria.vazios[i + 1]));
//                    log(typeof ($scope.memoria_secundaria.vazios[i + 1].init));
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