var funcProcessos = function ($scope) {
    return  {
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
            for (var i in p) {
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
};