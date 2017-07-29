var eliminar = function ($scope) {
    return function(p){
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
  
}