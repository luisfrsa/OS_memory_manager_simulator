$(document).ready(function(){
	for(i=1;i<=100;i++){
		$('#memoria_principal').append("<div class='div_memoria' id='memoria_"+i+"'></div>");
		$('#memoria_virtual').append("<div class='div_memoria' id='memoria_"+i+"'></div>");
	}
});
