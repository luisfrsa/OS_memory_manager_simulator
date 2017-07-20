$(document).ready(function(){
	for(i=1;i<=100;i++){
		$('#memoria_principal').append("<div class='div_memoria' id='memoria_"+i+"'></div>");
		$('#memoria_virtual').append("<div class='div_memoria' id='memoria_"+i+"'></div>");
	}
});
var cor_memoria = ['yellow','red','aqua','aquamarine','beige','black','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgrey','darkgreen','darkkhaki','darkmagenta','darkolivegreen','darkorange darksalmon','darkslateblue','darkslategrey','darkturquoise','darkviolet','deeppink','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gold','green','greenyellow','hotpink','indianred','indigo','khaki','lawngreen','lemonchiffon'];
