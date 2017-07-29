var memoria_secundaria = function ($scope) {
    return {
        size: 0,
        max_size: 100,
        processes: [],
        init: function () {
            for (var i = 0; i < $scope.memoria_secundaria.max_size; i++) {
                $scope.memoria_secundaria.processes.push({
                    id: -1,
                    frames: 1,
                    memoria_livre: true,
                    cor: 'vazio',
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
        buscaEspacoVazio: function (tamanho) {
            var indicevazio = 0;
            if (($scope.memoria_secundaria.size + tamanho) <= $scope.memoria_secundaria.max_size) {
                for (var indice_memoria = 0; indice_memoria < $scope.memoria_secundaria.max_size; indice_memoria++) {
                    if ($scope.memoria_secundaria.processes[indice_memoria].memoria_livre === true) {
                        indicevazio++;
                        if (indicevazio >= tamanho) {
//                            log(' retorno vazio ' + (indice_memoria - tamanho + 1));
                            return (indice_memoria - tamanho + 1);
                        }
                    } else {
                        indicevazio = 0;
                    }
                }
            }
            return false;
        },
        buscaPrimeiro: function () {
            var dados = $scope.memoria_secundaria.shiftProcesso();
            var processo = $scope.memoria_secundaria.newProcess(dados.process);
            processo.frames = dados.length;
            for (var i = 0; i < dados.length; i++) {
                $scope.memoria_secundaria.processes[i + dados.init] = {};
                $scope.memoria_secundaria.processes[i + dados.init].memoria_livre = true;
                $scope.memoria_secundaria.processes[i + dados.init].cor = "vazio";
                $scope.memoria_secundaria.processes[i + dados.init].id = -1;
                $scope.memoria_secundaria.processes[i + dados.init].prioridade = 0;
//            log($scope.memoria_secundaria.processes[i + dados.init]);
//            log(i + dados.init);
            }
            return processo;
        },
        shiftProcesso: function () {
            var indiceProcesso = 0;
            var idProcesso = null;
            for (var indice_memoria = 0; indice_memoria < $scope.memoria_secundaria.max_size; indice_memoria++) {
                if ($scope.memoria_secundaria.processes[indice_memoria].memoria_livre === false && idProcesso === null) {
                    idProcesso = $scope.memoria_secundaria.processes[indice_memoria].id;
                }
                if (idProcesso !== null && idProcesso !== $scope.memoria_secundaria.processes[indice_memoria].id) {
                    return {
                        process: $scope.memoria_secundaria.processes[indice_memoria - 1],
                        init: (indice_memoria - indiceProcesso),
                        length: indiceProcesso,
                    };
                }
                indiceProcesso++;
            }
            return {
                process: null,
                init: 0,
                length: 0,
            };
        },
        getPrimeiroProcessoRemovivel: function (tamanho) {
            /*pode ser que esteja querendo colocar um procesos de tamanho 5, mas só tem 1 processo na lista toda, com tamanho 2, tratar este tipo de caso*/
            var indiceProcesso = 0;
            for (var indice_memoria = 0; indice_memoria < $scope.memoria_secundaria.max_size; indice_memoria++) {
                if ($scope.memoria_secundaria.processes[indice_memoria].memoria_livre === false) {
                    indiceProcesso++;
                    if (indiceProcesso >= tamanho) {
                        var processo_retorno = $scope.memoria_secundaria.processes[indice_memoria];
//                        log(' retorno vazio ' + (indice_memoria - tamanho + 1));
                        return (indice_memoria - tamanho + 1);
                    }
                } else {
                    indiceProcesso = 0;
                }
            }
            return false;
        },
    };
}