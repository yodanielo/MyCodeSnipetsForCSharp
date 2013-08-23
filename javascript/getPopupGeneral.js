$.getPopupGeneral = function (m_settings) {

    var settings = {
        formURL: "",
        params: "",
        title: "Seleccione un registro",
        select: null,
        cancel: null,
        beforeShow: null,
        tieneGrid: true,
        /*parametros generales*/
        nombreDiv: "div",
        nombreGrid: "grid",
        estado: "",
        HideSelection: true,
        EndClose: null,
        width: "auto",
        height:"auto",
        multiSelect: false,
        selectable: true,
        formPage:null
    }
    settings = $.extend(settings, m_settings);
    var objBox;
    var nombreDiv = "#" + settings["nombreDiv"].split("#").join("");
    var nombreGrid = "#" + settings["nombreGrid"].split("#").join("");;
    if ($(nombreDiv).length == 0) {
        auxObjBox = document.createElement("div");
        auxObjBox.setAttribute("id", nombreDiv.split("#").join(""));
        document.getElementsByTagName("body")[0].appendChild(auxObjBox);
    }
    objBox = $(nombreDiv)[0];
    miBlock(true, settings.formPage);
    $.ajax({
        url: settings["formURL"],
        type: 'post',
        data: settings["params"],
        contentType: "application/json",
        success: function (datos) {
            miBlock(false, settings.formPage);
            $(objBox).html(datos);
            if ($.isFunction(settings["beforeShow"])) {
                auxfun = settings["beforeShow"];
                auxfun(objBox);
            }
            //window.scrollTo(0, 0);
            $(objBox).dialog({
                title: settings["title"],
                width: settings.width,
                height: settings.height,
                modal: true,
                autoOpen: false,
                zIndex: 10000,
                show: {
                    effect: "fade",
                    duration: 450
                },
                hide: {
                    effect: "fade",
                    duration: 450
                },
                buttons: {
                    "Seleccionar": function () {
						if ($.isFunction(settings["select"])) {
							var auxfun = settings["select"];
							var res = auxfun(ret);//si retorna true, cierra el dialog, sino no
							if (res) {
								settings.estado = "Ok";
								$(this).dialog("close");
							}
						}
                    },
                    "Cancelar": function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    if ($.isFunction(settings.EndClose)) {
                        if (settings.estado.length == 0) {
                            auxfun = settings.EndClose;
                            auxfun(objBox);
                        }
                    }
                }
            });
            $(objBox).dialog("open");
            if (settings.HideSelection == true) {
                $(nombreDiv).parent().find(".ui-dialog-buttonpane").hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            miBlock(false, settings.formPage);
            alert(ajaxOptions + ":" + thrownError);
        }
    });
}