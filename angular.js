var app = angular.module("appMemory", []);
function log(p){
	console.log(p);
}
app.controller("memoryCtrl", function($scope) {
	$scope.process = [];
	$scope.lastId=0;
	$scope.processes =[
	{id:0,ativo:true,cor:'blue',estado:1,frames:5},
	{id:1,ativo:false,cor:'red',estado:2,frames:5},
	];
	$scope.addProcess = function (p) {
		log(p);
		p.id=++$scope.lastId;
		p.ativo=true;
		p.estado=1;
		p.cor = cor_memoria[$scope.lastId%cor_memoria.length];
		$scope.processes.push(p);
	} 
});