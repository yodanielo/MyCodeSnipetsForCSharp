$.fn.enable = function (valor) {
    $(this).each(function () {
        objpadre = this;
        objimage = this;
        tipopadre = $(objpadre).prop("tagName");
        if (tipopadre == "INPUT" && $(objpadre).attr("type") == "text") {
            if (valor) {
                $(objpadre).removeAttr("readonly", "readonly");
                $(objpadre).removeClass("disabled_image");
                $(objpadre).removeAttrs("disabled");
            }
            else {
                $(objpadre).attr("readonly", "readonly");
                $(objpadre).attr("disabled", "disabled");
                $(objpadre).addClass("disabled_image");
            }
        }
        else {
            if (valor) {
                $(objpadre).removeAttr("disabled", "disabled");
                $(objpadre).removeClass("disabled_image");
                $(objpadre).removeAttrs("disabled");
            }
            else {
                $(objpadre).attr("disabled", "disabled");
                $(objpadre).addClass("disabled_image");
            }
        }
    });
}