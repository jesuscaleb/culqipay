// Get Request URL Params 
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

$(function () {
    try {

        // Get Params Values in URL
        var asesor = getUrlParameter('as');
        var fecha = getUrlParameter('fec');
        var corr = getUrlParameter('corr');
        var codref = getUrlParameter('ref');
        var mto = getUrlParameter('mto');
        var moneda = getUrlParameter('mon');
        var idcurso = getUrlParameter('idc');
        
        $.ajax({
            url: 'data/load.php',
            method: 'POST',        
            data:{
                valid: 'true',
                asesor: asesor,
                fecha: fecha,
                corr: corr,
                codref: codref,
                mto: mto,
                moneda: moneda,
                idcurso: idcurso
            },
            success:function (data) {
                var response = jQuery.parseJSON(data);
                $(".ref").text(response.codref);
                $(".as").text(response.asesor);
                $(".idc").text(response.idcurso);
                $(".mon").text("Monto a pagar ( " + response.moneda + " ):");
                $(".mto").text(response.mto + " (" + response.moneda + ")");
                // console.log(response);
            },
            error:function (e) {
                console.log(e);
            }
        });
    } catch (error) {
        console.log(error);
    }
});

$(function() {
    $('input[name="inputCardNumber"]').validateCreditCard(function(result) {
        var card;
        if(result.card_type != null){
            card =  result.card_type.name;
        }else{
            card = 'none';
        }
        switch (card) {
            case 'visa':
                $('.card-icon').removeAttr('src');
                $('.card-icon').attr('src','img/visa.png');
            break;
            case 'mastercard':
                $('.card-icon').removeAttr('src');
                $('.card-icon').attr('src','img/mastercard.png');
            break;
            case 'diners_club_international':
                $('.card-icon').removeAttr('src');
                $('.card-icon').attr('src','img/diners.png');
            break;
            case 'amex':
                $('.card-icon').removeAttr('src');
                $('.card-icon').attr('src','img/american.png');
            break;
            case 'none':
                $('.card-icon').removeAttr('src');
                $('.card-icon').attr('src','img/defaultcard.png');
            break;            
        }
    });
});

/*
function generateReferenceCode() {
    var d = new Date();
    var year = String(d.getFullYear());
    var month = String(( '0' + (d.getMonth()+1) ).slice( -2 ));
    var day = String(d.getDate());
    var currentDate = year + month + day;
    return currentDate;
}*/

$(document).ready(function () {
    Culqi.publicKey = ''; // Ingresar llave publica de tu cuenta de Culqi
    Culqi.init();
});

$.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
}, "Letters, numbers, and underscores only please but not whitespaces and arrobas");

$('#buyButton').on('click', function() {
    // Bloquear el boton y luego la animacion de carga.
    $("#error-message").addClass("d-none");
    
    var validator = $('#itsystems-form').validate({
        focusCleanup: true, // Cleans error message when user clicks on input
        rules:{
            inputCardNumber:{
                required:true,
                alphanumeric:true,
                digits:true
            },
            inputEmail:{
                required:true,
                email: true
            },
            inputExpMonth:{
                required:true,
                alphanumeric:true,
                digits:true
            },
            inputExpYear:{
                required:true,
                alphanumeric:true,
                digits:true
            },
            inputCVV:{
                required:true,
                alphanumeric:true,
                digits:true
            },        
            chkpol:{
                required: true
            }
        },
        messages:{
            inputCardNumber:{
                required:"Campo obligatorio.",
                alphanumeric:"No se permiten espacios en blanco u otro caracter.",
                digits: "Ingrese solo números."
            },
            inputEmail:{
                required:"Campo obligatorio.",
                email: "Correo no válido."
            },
            inputExpMonth:{
                required:"Campo obligatorio.",
                alphanumeric:"Ingrese solo números.",
                digits: "Ingrese solo números."
            },
            inputExpYear:{
                required:"Campo obligatorio.",
                alphanumeric:"Ingrese solo números.",
                digits: "Ingrese solo números."
            },
            inputCVV:{
                required:"Campo obligatorio.",
                alphanumeric:"Ingrese solo números.",
                digits: "Ingrese solo números."
            },
            chkpol:{
                required: "Este campo es obligatorio"
            }
        },
        errorPlacement: function( label, element ) {
            if( element.attr( "name" ) === "audience[]" || element.attr( "name" ) === "event_services[]" ) {
                element.parent().append( label );
            } else if (element.attr("name") == "inputCardNumber"){
                label.insertAfter("#cardNumError");
            } else {
                label.insertAfter( element ); // standard behaviour
            }
        }        ,
        submitHandler: function(form) {
            // Executes waitMeJs element effect
            $('#itsystems-payment').waitMe({
                effect : 'rotateplane',
                text : 'Por favor, espere...',
                bg : 'rgba(255,255,255,0.7)',
                color : '#01012b',
                maxSize : '40',
                waitTime : -1,
                textPos : 'vertical',
                fontSize : '18px',
                source : '',
                onClose : function() {}
            });

            // Generate Culqi Token
            Culqi.createToken();
            return false;
        }
    });
    
});

function culqi() {

    if (Culqi.token) { // ¡Objeto Token creado exitosamente!
        var token = Culqi.token.id;
        // Get Parameter data in URL
        var asesor = getUrlParameter('as');
        var fecha = getUrlParameter('fec');
        var corr = getUrlParameter('corr');
        var codref = getUrlParameter('ref');
        var mto = getUrlParameter('mto');
        var moneda = getUrlParameter('mon');
        var idcurso = getUrlParameter('idc');
        var form = $("#itsystems-form");
        $.ajax({
            url: 'data/server.php',
            method: 'POST',
            dataType: 'JSON',
            data:{
                token: token,
                monto: mto.split(".").join(""), // Removes dot in decimal number and get full number
                email: $('input[name="inputEmail"]').val(),
                asesor: asesor,
                fecha: fecha,
                corr : corr,
                codref: codref,
                precio : mto,
                moneda: moneda,
                idcurso: idcurso
            },
            success:function (data) {
                
                try {
                    switch (data.object) {
                        case 'charge':
                            // Convertir el array String a JSON exclusivamente para el array de validación correcta (final)
                            $("#itsystems-payment").waitMe("hide");  
                            $(".after-post").css('display', 'none');
                            var src_icon = "img/exito.png";
                            // Encabezado del mensaje 
                            $('.response-header').append("<div style='padding: 40px;'><img class='response-img' src='"+ src_icon +"'><h2 class='response-title'>"+ data.outcome.user_message +"</h2></div>");
                            // Cuerpo del mensaje 
                            $('.response-content')
                            .append("<div style='padding:20px;'><div class='row'><div class='col-6'><p class='response-title'>Su código de referencia es:</p></div><div class='col-6'><p class='response-desc'>"+ data.metadata.codigo_referencia +"</p class='response-desc'></div></div><div class='row'><div class='col-6'><p class='response-title'>Curso asignado:</p></div><div class='col-6'><p class='response-desc'>"+ data.metadata.curso +"</p></div></div><div class='row'><div class='col-6'><p class='response-title'>Monto total pagado:</p></div><div class='col-6'><p class='response-desc'> "+ data.metadata.monto + " ( " + data.metadata.moneda +" )</p></div></div></div>");
                            form[0].reset(); // clear out the form data
                            // console.log(data);
                        break;
                        case 'error':
                            // Convertir el array a String exclusivamente para el array de error (response)
                            $("#itsystems-payment").waitMe("hide");  
                            $(".error-message-detail").text(data.user_message);
                            $("#error-message").removeClass("d-none");
                            form[0].reset(); // clear out the form data
                            console.log(data);
                        break;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            error:function (e) {
                $("#itsystems-payment").waitMe("hide");  
                $(".error-message-detail").text("Hubo un problema con el envío. Por favor inténtalo más tarde.");
                $("#error-message").removeClass("d-none");
                form[0].reset(); // clear out the form data
                console.log(e);
            }
        });
    } else { // ¡Hubo algún problema!
        // Mostramos JSON de objeto error en consola
        $("#itsystems-payment").waitMe("hide");  
        $(".error-message-detail").text(Culqi.error.user_message);
        $("#error-message").removeClass("d-none");
        form[0].reset(); // clear out the form data
        console.log(Culqi.error);
    }
};