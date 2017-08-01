var eliminar = function ($scope) {
    return function (p) {
        $scope.processes = $scope.processes.filter(function (el) {
            return func_filtro(el, p);
            ;
        });
        if (in_array($scope.memoria_principal.processes, p)) {
            var index_removido = get_index_by_id($scope.memoria_principal.processes, p);
            $scope.memoria_principal.addVazio({init: index_removido, len: p.frames});

            for (var i = 0; i < $scope.memoria_principal.processes.length; i++) {
                if (typeof ($scope.memoria_principal.processes[i]) != 'undefined') {
                    if ($scope.memoria_principal.processes[i].id == p.id) {
//                        $scope.memoria_principal.processes.splice(i, 1);
                        $scope.memoria_principal.processes[i] = [];
                        break;
                    }
                }
            }

        }
//        if (in_array($scope.memoria_secundaria.processes, p)) {
//            $scope.memoria_secundaria.size -= p.frames;
//            $scope.memoria_secundaria.processes = $scope.memoria_secundaria.processes.filter(function (el) {
//                return func_filtro(el, p);
//                ;
//            });
//        }
        $scope.listaPrioridadeCPU = $scope.listaPrioridadeCPU.map(function (el) {
            return el.filter(function (e) {
                return  func_filtro(e, p);
            });
        });
    };
}