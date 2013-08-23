$(function () {
    $("body").on("keypress", ".solonumeros, .solodecimal, .soloentero, .soloalfanumerico", function (e) {
        // get decimal character and determine if negatives are allowed
        var decimal = ($(this).hasClass("solodecimal") ? "." : "");
        var negative = false;
        var asterisco = ($(this).hasClass("asterisco") ? "*" : "");
        // get the key that was pressed
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        // allow enter/return key (only when in an input box)
        if (key == 13 && this.nodeName.toLowerCase() == "input") {
            return true;
        }
        else if (key == 13) {
            return false;
        }
        var allow = false;
        // allow Ctrl+A
        if ((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) { return true; }
        // allow Ctrl+X (cut)
        if ((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) { return true; }
        // allow Ctrl+C (copy)
        if ((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) { return true; }
        // allow Ctrl+Z (undo)
        if ((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) { return true; }
        // allow or deny Ctrl+V (paste), Shift+Ins
        if ((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86) /* opera */ ||
		  (e.shiftKey && key == 45)) { return true; }

        var apareceAsterisco = false;;
        if ($(this).hasClass("solonumeros") && $(this).val().indexOf("*") > -1)
            apareceAsterisco = true;
        
        var pasa = true;

        if($(this).hasClass("solonumeros") || $(this).hasClass("soloentero") || $(this).hasClass("solodecimal")){
            if(key < 48 || key > 57){
                if (key == asterisco.charCodeAt(0) && $(this).hasClass("asterisco") && !apareceAsterisco)
                    pasa=true;
                else{
                    if(key==decimal.charCodeAt(0) && $(this).hasClass("solodecimal"))
                        pasa=true;
                    else
                        pasa=false;
                }
            }
            else{
                pasa=true;
            }
        }
        else{
            if($(this).hasClass("soloalfanumerico")){
                if((key < 97 || key > 122) && (key < 65 || key > 90) && (key < 48 || key > 57))
                    pasa=false;
                else
                    pasa=true;
            }
            else
                pasa=false;
        }
        
        // if a number was not pressed
        //if ((key < 48 || key > 57) || (key != 42 && asterisco == true && apareceAsterisco == true)) {
        if(!pasa){
            var value = $(this).val();
            /* '-' only allowed at start and if negative numbers allowed */
            //if (value.indexOf("-") !== 0 && negative && key == 45 && (value.length === 0 || parseInt(getSelectionStart(this), 10) === 0)) { return true; }
            /* only one decimal separator allowed */
            //if (decimal && key == decimal.charCodeAt(0) && value.indexOf(decimal) != -1) {
            //    allow = false;
            //}

            // check for other keys that have special purposes
            if (
				key != 8 /* backspace */ &&
				key != 9 /* tab */ &&
				key != 13 /* enter */ &&
				key != 35 /* end */ &&
				key != 36 /* home */ &&
				key != 37 /* left */ &&
				key != 39 /* right */ &&
				key != 46 /* del */
			) {
                allow = false;
            }
            else {
                // for detecting special keys (listed above)
                // IE does not support 'charCode' and ignores them in keypress anyway
                if (typeof e.charCode != "undefined") {
                    // special keys have 'keyCode' and 'which' the same (e.g. backspace)
                    if (e.keyCode == e.which && e.which !== 0) {
                        allow = true;
                        // . and delete share the same code, don't allow . (will be set to true later if it is the decimal point)
                        if (e.which == 46) { allow = false; }
                    }
                        // or keyCode != 0 and 'charCode'/'which' = 0
                    else if (e.keyCode !== 0 && e.charCode === 0 && e.which === 0) {
                        allow = true;
                    }
                }
            }
            // if key pressed is the decimal and it is not already in the field
            if (decimal && key == decimal.charCodeAt(0)) {
                if (value.indexOf(decimal) == -1) {
                    allow = true;
                }
                else {
                    allow = false;
                }
            }
        }
        else {
            allow = true;
        }
        return allow;
    })

    $("body").on("keyup", ".solonumeros, .solodecimal, .soloentero", function (e) {
        var val = $(this).val();
        if (val && val.length > 0) {
            // get carat (cursor) position
            var carat = getSelectionStart(this);
            var selectionEnd = getSelectionEnd(this);
            // get decimal character and determine if negatives are allowed
            var decimal = ($(this).hasClass("solodecimal") ? "." : "");
            var negative = false;
            var asterisco = ($(this).hasClass("asterisco") ? '*' : '');

            // prepend a 0 if necessary
            if (decimal !== "" && decimal !== null) {
                // find decimal point
                var dot = val.indexOf(decimal);
                // if dot at start, add 0 before
                if (dot === 0) {
                    this.value = "0" + val;
                }
                // if dot at position 1, check if there is a - symbol before it
                if (dot == 1 && val.charAt(0) == "-") {
                    this.value = "-0" + val.substring(1);
                }
                val = this.value;
            }

            if (asterisco=="*" && val.indexOf("*") > -1) {
                i = 0;
                var cad = "";
                var encontrado = false;
                while (i < val.length) {
                    if (val.charAt(i) != "*")
                        cad += val.charAt(i);
                    else {
                        if (encontrado == false) {
                            cad += val.charAt(i);
                            encontrado = true;
                        }
                    }
                    i++;
                }
                val = cad;
            }

            // if pasted in, only allow the following characters
            var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '-', decimal, asterisco];
            // get length of the value (to loop through)
            var length = val.length;
            // loop backwards (to prevent going out of bounds)
            for (var i = length - 1; i >= 0; i--) {
                var ch = val.charAt(i);
                // remove '-' if it is in the wrong place
                if (i !== 0 && ch == "-") {
                    val = val.substring(0, i) + val.substring(i + 1);
                }
                    // remove character if it is at the start, a '-' and negatives aren't allowed
                else if (i === 0 && !negative && ch == "-") {
                    val = val.substring(1);
                }
                var validChar = false;
                // loop through validChars
                for (var j = 0; j < validChars.length; j++) {
                    // if it is valid, break out the loop
                    if (ch == validChars[j]) {
                        validChar = true;
                        break;
                    }
                }
                // if not a valid character, or a space, remove
                if (!validChar || ch == " ") {
                    val = val.substring(0, i) + val.substring(i + 1);
                }
            }
            // remove extra decimal characters
            var firstDecimal = val.indexOf(decimal);
            if (firstDecimal > 0) {
                for (var k = length - 1; k > firstDecimal; k--) {
                    var chch = val.charAt(k);
                    // remove decimal character
                    if (chch == decimal) {
                        val = val.substring(0, k) + val.substring(k + 1);
                    }
                }
            }
            // set the value and prevent the cursor moving to the end
            this.value = val;
            setSelection(this, [carat, selectionEnd]);
        }
    });

    $("body").on("keyup", ".asterisco:not(.solonumeros, .solodecimal, .soloentero)", function (e) {
        var val = $(this).val();
        if (val && val.length > 0) {
            // get carat (cursor) position
            var carat = getSelectionStart(this);
            var selectionEnd = getSelectionEnd(this);
            // get decimal character and determine if negatives are allowed
            i = 0;
            var cad = "";
            var encontrado = false;
            while (i < val.length) {
                if (val.charAt(i) != "*")
                    cad += val.charAt(i);
                else {
                    if (encontrado == false) {
                        cad += val.charAt(i);
                        encontrado = true;
                    }
                }
                i++;
            }
            val = cad;
            // set the value and prevent the cursor moving to the end
            this.value = val;
            setSelection(this, [carat, selectionEnd]);
        }
    });

    // Based on code from http://javascript.nwbox.com/cursor_position/ (Diego Perini <dperini@nwbox.com>)
    getSelectionStart = function (o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', o.value.length);
            if (r.text === '') { return o.value.length; }
            return o.value.lastIndexOf(r.text);
        } else { return o.selectionStart; }
    };

    // Based on code from http://javascript.nwbox.com/cursor_position/ (Diego Perini <dperini@nwbox.com>)
    getSelectionEnd = function (o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate()
            r.moveStart('character', -o.value.length)
            return r.text.length
        } else return o.selectionEnd
    }

    // set the selection, o is the object (input), p is the position ([start, end] or just start)
    setSelection = function (o, p) {
        // if p is number, start and end are the same
        if (typeof p == "number") { p = [p, p]; }
        // only set if p is an array of length 2
        if (p && p.constructor == Array && p.length == 2) {
            if (o.createTextRange) {
                var r = o.createTextRange();
                r.collapse(true);
                r.moveStart('character', p[0]);
                r.moveEnd('character', p[1]);
                r.select();
            }
            else if (o.setSelectionRange) {
                o.focus();
                o.setSelectionRange(p[0], p[1]);
            }
        }
    };
});