var app = angular.module("appMemory", []);
function log(p){
	console.log(p);
}
app.controller("memoryCtrl", function($scope) {
	$scope.lastId=0;
	$scope.process =  {
		tipo:"CPU",
		frames:5,
		prioridade:1,
	};
	$scope.memoria_principal = {
		size:0,
		max_size:100,
		processes:[],
	};
	$scope.processes =[];
	$scope.zeraProcess = function(){
		$scope.process = {
			tipo:"CPU",
			frames:5,
			prioridade:1,
		};
	};
	$scope.suspender_retomar = function(p){
		p.ativo = !p.ativo;
	}
	$scope.eliminar = function(p){
		$scope.processes.filter(function(el){
			return (el==p);
		});
	}
	$scope.addProcessMemory=function(p){
		var novoTam =$scope.memoria_principal.size+=p.frames; 
		if(novoTam <=$scope.memoria_principal.max_size){
			$scope.memoria_principal.size = novoTam;
			$scope.memoria_principal.processes.push(p);
		}
	};
	$scope.addProcess = function (p) {
		log(p);
		p.id=++$scope.lastId;
		p.ativo=true;
		p.estado=1;
		p.cor = cor_memoria[$scope.lastId%cor_memoria.length];
		$scope.processes.push(p);
		$scope.addProcessMemory(p);
		$scope.zeraProcess();
	} 
	$scope.addProcess({estado:1,frames:5,priodirade:1,tipo:"IO"},);
	$scope.addProcess({estado:2,frames:5,priodirade:1,tipo:"CPU"});
	

});