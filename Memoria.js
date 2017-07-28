var Memoria = function (max_size) {

    this.size = 0;
    this.max_size = max_size || 20;
    this.processes = [];
    this.init = function () {
        for (var i = 0; i < this.max_size; i++) {
            this.processes.push({
                id: -1,
                frames: 1,
                memoria_livre: true,
                cor: 'vazio',
            });
        }
    };
    this.newProcess = function (p) {
        var novo = {};
        for (var i in p) {
            novo[i] = p[i];
        }
        return novo;
    };
    this.buscaEspacoVazio = function (tamanho) {
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
    };

    this.buscaPrimeiro = function () {
        var dados = this.shiftProcesso();
        var processo = this.newProcess(dados.process);
        processo.frames = dados.length;
        for (var i = 0; i < dados.length; i++) {
            this.processes[i + dados.init] = {};
            this.processes[i + dados.init].memoria_livre = true;
            this.processes[i + dados.init].cor = "vazio";
            this.processes[i + dados.init].id = -1;
            this.processes[i + dados.init].prioridade = 0;
//            log(this.processes[i + dados.init]);
//            log(i + dados.init);
        }
        return processo;
    };
    this.shiftProcesso = function () {
        var indiceProcesso = 0;
        var idProcesso = null;
        for (var indice_memoria = 0; indice_memoria < this.max_size; indice_memoria++) {
            if (this.processes[indice_memoria].memoria_livre === false && idProcesso === null) {
                idProcesso = this.processes[indice_memoria].id;
            }
            if (idProcesso !== null && idProcesso !== this.processes[indice_memoria].id) {
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
        };
    };
    this.getPrimeiroProcessoRemovivel = function (tamanho) {
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
    };

};