var app = angular.module("appMemory", []);
function log(p, str) {
    if (str) {
        console.log(p);
    }
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
        newProcess: function (p) {
            var novo = {};
            for (i in p) {
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
    $scope.memoria_principal = {
        size: 0,
        max_size: 20,
        processes: [],
        init: function () {
            for (var i = 0; i < this.max_size; i++) {
                this.processes.push({
                    id: -1,
                    frames: 1,
                    memoria_livre: true,
                    cor: 'vazio',
                });
            }
        },
        add: function (p) {
            var numFrames = p.frames;
            var indexInsert = this.buscaEspacoVazio(numFrames);
            log("add");

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

        },
        buscaEspacoVazio: function (tamanho) {
//            log("processoa atuais");
//            log(this.processes);
            var indicevazio = 0;
            if ((this.size + tamanho) <= this.max_size) {
                for (var indice_memoria = 0; indice_memoria < this.max_size; indice_memoria++) {
                    if (this.processes[indice_memoria].memoria_livre === true) {
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
            var dados = this.shiftProcesso();
            var processo = $scope.funcProcessos.newProcess(dados.process);
            processo.frames = dados.length;
            for (var i = 0; i <= dados.length; i++) {
                this.processes[i + dados.init].memoria_livre = true;
                this.processes[i + dados.init].cor = "vazio";
            }
            return processo;
        },
        shiftProcesso: function () {
            var indiceProcesso = 0;
            var idProcesso = null;
            for (var indice_memoria = 0; indice_memoria < this.max_size; indice_memoria++) {
                if (this.processes[indice_memoria].memoria_livre === false && idProcesso === null) {
                    idProcesso = this.processes[indice_memoria].id;
                }
                if (idProcesso !== null && idProcesso !== this.processes[indice_memoria].id) {
//                    log('return idproc ' + idProcesso);
//                    log('ind_mem ' + indice_memoria);
//                    log('indProc ' + indiceProcesso);
                    return {
                        process: this.processes[indice_memoria - 1],
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
            }
        },
        getPrimeiroProcessoRemovivel: function (tamanho) {
            /*pode ser que esteja querendo colocar um procesos de tamanho 5, mas só tem 1 processo na lista toda, com tamanho 2, tratar este tipo de caso*/
            var indiceProcesso = 0;
            for (var indice_memoria = 0; indice_memoria < this.max_size; indice_memoria++) {
                if (this.processes[indice_memoria].memoria_livre === false) {
                    indiceProcesso++;
                    if (indiceProcesso >= tamanho) {
                        var processo_retorno = this.processes[indice_memoria];
//                        log(' retorno vazio ' + (indice_memoria - tamanho + 1));
                        return (indice_memoria - tamanho + 1);
                    }
                } else {
                    indiceProcesso = 0;
                }
            }
            return false;
        }


    };

    $scope.memoria_principal.init();
    $scope.memoria_secundaria = {
        size: 0,
        max_size: 100,
        processes: [],
        add: function (p) {
            var numFrames = p.frames;
            var indexInsert = this.buscaEspacoVazio(numFrames);
            log("add");

            if (indexInsert !== false) {
                $scope.memoria_principal.size += numFrames;
                for (var i = 0; i < numFrames; i++) {
                    var processo_memoria = new $scope.funcProcessos.newProcess(p);
//                    log(processo_memoria);
                    processo_memoria.frames = 1;
                    $scope.memoria_principal.processes[ indexInsert + i] = processo_memoria;
                }
            }
        }
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
        clock: 1000,
        pop: function () {
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
                        log("Inserindo " + $scope.cpu.id + "na M.principal");
                        $scope.memoria_secundaria.processes.push(processo_p);
                        $scope.memoria_secundaria.processes = $scope.memoria_secundaria.processes.filter(function (el) {
                            return  func_filtro(el, $scope.cpu);
                        });
                        $scope.memoria_principal.processes.push($scope.cpu);
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