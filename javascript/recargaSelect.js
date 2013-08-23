///RecargarSelect
///elementos: array que contiene los elemntos a setear en el select
///selectId: el ID del selector
///value: (opcional) valor que se seleccionará por defecto dentro de la lista
///propiedades: (opcional) un array conteniendo los nombres de las propiedades de donde sacar los datos
///ejemplo: 
///RecargarSelect(
///    [
///        {valor:"1", nombre:"Pedro"},
///        {valor:"2", nombre:"Hugo"}
///    ],
///    "#miselect",
///    "2",
///    {
///        ID: "valor",
///        Datos:"nombre"
///    }
///)
function RecargarSelect(elementos, selectId, value, propiedades, optLabel) {
    setprops = {
        ID: "ID",
        Datos: "Datos"
    }
    if (propiedades != null)
        setprops = $.extend(setprops, propiedades);
    var subSelect = document.getElementById(selectId.replace("#", ""));
    $(subSelect).html("");
    var option = document.createElement("option");
    option.text = "-Seleccione-";
    if (optLabel == "Todas") {
        option.text = "-Todas-";
    }
    option.value = "";
    subSelect.add(option, null);
    for (i = 0; i < elementos.length; i++) {
        var option = document.createElement("option");
        option.text = elementos[i][setprops.Datos];
        option.value = elementos[i][setprops.ID];
        if (value !== null) {
            if (elementos[i][setprops.ID] == value) {
                option.selected = value;
            }
        }
        subSelect.add(option, null);
    }
}