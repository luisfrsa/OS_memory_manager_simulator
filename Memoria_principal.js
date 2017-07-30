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
            var numFrames = p.frames;
            var insert = $scope.memoria_principal.getEspacoVazio(numFrames);
            if (insert !== false) {
                log(insert, "busca espaco vazio-> ");
                $scope.memoria_principal.processes[insert.init] = new $scope.funcProcessos.newProcess(p);
                log($scope.memoria_principal.processes);
//                for (var i = 0; i < numFrames; i++) {
//                    var processo_memoria = new $scope.funcProcessos.newProcess(p);
////                    log(processo_memoria);
//                    processo_memoria.frames = 1;
//                    $scope.memoria_principal.processes[ indexInsert + i] = processo_memoria;
//                }
            } else {
                $scope.memoria_principal.removePrimeiro(numFrames);
//                $scope.memoria_principal.add(p);
                //add secundaria
            }
        },
        removePrimeiro: function (tamanho) {
            var indice = 0;
            for (var i in $scope.memoria_principal.processes) {
                if (typeof ($scope.memoria_principal.processes[i]) !== 'undefined') {
                    $scope.memoria_principal.vazios.push({});
                    $scope.memoria_principal.processes.splice(i, 1);
//                    return $scope.memoria_principal.processes[i];
//sei la, ele vai remover mas estou com dificuldade em pegar o init
//talvez varrer memoria vazios e processos paralelamente seja uma alternativa
                }
            }
            return false;//ver pois tamanho pode ter 10 processos de tam 2, e pedir para alocar tamanho 3, vai varrer tudo e nao achar nada, melhor solucao: while nao tiver tamanho,remove primeiro, e chama novamente a recursao, nao esquecer de dar merge de espaços vazios
//nao precisa mostrar espaços vazios visualmente (branco), basta apenas quando for inserir processo, inserir entre p1 e p2, que simula a insercao no primeiro espaço vazio
        },
        addVazio: function (elem) {
            log($scope.memoria_principal.vazios, "vazios antes add");
            $scope.memoria_principal.vazios.push(elem);
            $scope.memoria_principal.vazios.sort(function (a, b) {
                return (a.init > b.init) ? 1 : ((b.init > a.init) ? -1 : 0);
            });
            log($scope.memoria_principal.vazios, "vazios apos add");
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
                        log($scope.memoria_principal.vazios[i], "antes ");
                        $scope.memoria_principal.vazios[i] = {
                            init: $scope.memoria_principal.vazios[i].init + tamanho,
                            len: $scope.memoria_principal.vazios[i].len - tamanho
                        };
                        log($scope.memoria_principal.vazios[i], "depois");
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
    }
}
//var memoria_principal = function ($scope) {
//    return {
//        size: 0,
//        max_size: 20,
//        processes: [],
//        init: function () {
//            for (var i = 0; i < $scope.memoria_principal.max_size; i++) {
//                $scope.memoria_principal.processes.push({
//                    id: -1,
//                    frames: 1,
//                    memoria_livre: true,
//                    cor: 'vazio',
//                });
//            }
//        },
//        newProcess: function (p) {
//            var novo = {};
//            for (var i in p) {
//                novo[i] = p[i];
//            }
//            return novo;
//        },
//        buscaEspacoVazio: function (tamanho) {
//            var indicevazio = 0;
//            if (($scope.memoria_principal.size + tamanho) <= $scope.memoria_principal.max_size) {
//                for (var indice_memoria = 0; indice_memoria < $scope.memoria_principal.max_size; indice_memoria++) {
//                    if ($scope.memoria_principal.processes[indice_memoria].memoria_livre === true) {
//                        indicevazio++;
//                        if (indicevazio >= tamanho) {
////                            log(' retorno vazio ' + (indice_memoria - tamanho + 1));
//                            return (indice_memoria - tamanho + 1);
//                        }
//                    } else {
//                        indicevazio = 0;
//                    }
//                }
//            }
//            return false;
//        },
//        buscaPrimeiro: function () {
//            var dados = $scope.memoria_principal.shiftProcesso();
//            var processo = $scope.memoria_principal.newProcess(dados.process);
//            processo.frames = dados.length;
//            for (var i = 0; i < dados.length; i++) {
//                $scope.memoria_principal.processes[i + dados.init] = {};
//                $scope.memoria_principal.processes[i + dados.init].memoria_livre = true;
//                $scope.memoria_principal.processes[i + dados.init].cor = "vazio";
//                $scope.memoria_principal.processes[i + dados.init].id = -1;
//                $scope.memoria_principal.processes[i + dados.init].prioridade = 0;
////            log($scope.memoria_principal.processes[i + dados.init]);
////            log(i + dados.init);
//            }
//            return processo;
//        },
//        shiftProcesso: function () {
//            var indiceProcesso = 0;
//            var idProcesso = null;
//            for (var indice_memoria = 0; indice_memoria < $scope.memoria_principal.max_size; indice_memoria++) {
//                if ($scope.memoria_principal.processes[indice_memoria].memoria_livre === false && idProcesso === null) {
//                    idProcesso = $scope.memoria_principal.processes[indice_memoria].id;
//                }
//                if (idProcesso !== null && idProcesso !== $scope.memoria_principal.processes[indice_memoria].id) {
//                    return {
//                        process: $scope.memoria_principal.processes[indice_memoria - 1],
//                        init: (indice_memoria - indiceProcesso),
//                        length: indiceProcesso,
//                    };
//                }
//                indiceProcesso++;
//            }
//            return {
//                process: null,
//                init: 0,
//                length: 0,
//            };
//        },
//        getPrimeiroProcessoRemovivel: function (tamanho) {
//            /*pode ser que esteja querendo colocar um procesos de tamanho 5, mas só tem 1 processo na lista toda, com tamanho 2, tratar este tipo de caso*/
//            var indiceProcesso = 0;
//            for (var indice_memoria = 0; indice_memoria < $scope.memoria_principal.max_size; indice_memoria++) {
//                if ($scope.memoria_principal.processes[indice_memoria].memoria_livre === false) {
//                    indiceProcesso++;
//                    if (indiceProcesso >= tamanho) {
//                        var processo_retorno = $scope.memoria_principal.processes[indice_memoria];
////                        log(' retorno vazio ' + (indice_memoria - tamanho + 1));
//                        return (indice_memoria - tamanho + 1);
//                    }
//                } else {
//                    indiceProcesso = 0;
//                }
//            }
//            return false;
//        },
//        add: function (p) {
//            var numFrames = p.frames;
//            var indexInsert = $scope.memoria_principal.buscaEspacoVazio(numFrames);
//            log("add");
//            log(indexInsert);
//            if (indexInsert !== false) {
//                $scope.memoria_principal.size += numFrames;
//                for (var i = 0; i < numFrames; i++) {
//                    var processo_memoria = new $scope.funcProcessos.newProcess(p);
////                    log(processo_memoria);
//                    processo_memoria.frames = 1;
//                    $scope.memoria_principal.processes[ indexInsert + i] = processo_memoria;
//                }
//            } else {
//                //add secundaria
//            }
//
////            log($scope.memoria_principal.shiftProcesso());
//            return;
//            if (p.memoria_livre) {
//                $scope.memoria_principal.size += p.frames;
//            }
//            if (novoTam <= $scope.memoria_principal.max_size) {
//                $scope.memoria_principal.size = novoTam;
//                $scope.memoria_principal.processes.push(p);
//            } else {
//                var novoTamSec = $scope.memoria_secundaria.size += p.frames;
//                if (novoTam <= $scope.memoria_secundaria.max_size) {
//                    $scope.memoria_secundaria.size = novoTam;
//                    $scope.memoria_secundaria.processes.push(p);
//                }
//            }
//        },
//    }
//}