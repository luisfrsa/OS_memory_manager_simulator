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
//                $scope.CPU.addLista(p);
                $scope.CPU.escalonamento.add(p);
                $scope.listaSuspendidos = $scope.listaSuspendidos.filter(function (el) {
                    return func_filtro(el, p);
                });
            }
        },
        addIO: function (p) {
            $scope.listaIO.push(p);
            setTimeout(function () {
                $scope.listaIO = $scope.listaIO.filter(function (el) {
                    return func_filtro(el, p);
                });
                $scope.CPU.escalonamento.add(p);
            }, 7000);
        }
        ,
        newProcess: function (p) {
            var novo = {};
            for (var i in p) {
                novo[i] = p[i];
            }
            return novo;
        },
        addProcess: function (p) {
            var num_frames = p.frames;
            p.id = ++$scope.lastId;
            p.new = true;
            p.ativo = true;
            p.memoria_livre = false;
            p.eliminar = false;
            p.estado = 1;
            p.cor = cor_memoria[$scope.lastId % cor_memoria.length];
            $scope.processes.push(p);
            $scope.CPU.escalonamento.add(p);

            $scope.funcProcessos.zeraProcess();
        },
        eliminarClick: function (p) {
            p.eliminar = true;
        },
    };
};