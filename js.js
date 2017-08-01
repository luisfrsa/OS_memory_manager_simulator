$(document).ready(function () {
    for (i = 1; i <= 100; i++) {
        break;
        $('#memoria_principal').append("<div class='div_memoria' id='memoria_" + i + "'></div>");
        $('#memoria_virtual').append("<div class='div_memoria' id='memoria_" + i + "'></div>");
    }
});
var cor_memoria = ['yellow', 'red', 'aqua', 'aquamarine', 'beige', 'black', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange darksalmon', 'darkslateblue', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gold', 'green', 'greenyellow', 'hotpink', 'indianred', 'indigo', 'khaki', 'lawngreen', 'lemonchiffon'];


var in_array = function (array, elem) {
    if (typeof (array) === 'undefined' || typeof (elem) === 'undefined') {
        log("in_array com undefined");
        log(array);
        log(elem);
        return false;
    }
    for (var i in array) {
        if (array[i].id === elem.id) {
            return true;
        }
    }
    return false;
};

function get_index_by_id(array, elem) {
    if (typeof (array) === 'undefined' || typeof (elem) === 'undefined') {
        log("in_array com undefined");
        log(array);
        log(elem);
        return false;
    }
    for (var i in array) {
        if (array[i].id === elem.id) {
            return parseInt(i);
        }
    }
    return false;
}
;

var func_filtro = function (el, p) {
    if (typeof (el) === 'undefined' || typeof (p) === 'undefined') {
        return false;
    }
    if (el.id != p.id) {
        return true;
    }
    return false;
};
function existeKey(obj, key) {
    if (typeof (obj) == 'undefined') {
        return false;
    }
    if (key in obj) {
        return true;
    }
    return false;
}