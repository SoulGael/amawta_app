function login() {
    app.dialog.progress('Iniciando autenticación');
    var usuario = $$('#usuario').val();
    var password = $$('#password').val();
    $.ajax({
        data: { "USUARIO": usuario, "PASSWORD": password },
        //Cambiar a type: POST si necesario
        type: "GET",
        // Formato de datos que se espera en la respuesta
        dataType: "json",
        // URL a la que se enviará la solicitud Ajax
        url: server + "select_app_usuario.php",


    }).done(function(data, textStatus, jqXHR) {
        if (console && console.log) {
            app.dialog.close();
            if (data.validacion == "ok") {
                app.loginScreen.close('#my-login-screen');

                var notificationFull = app.notification.create({
                    icon: '<i class="icon icon-f7"></i>',
                    title: 'Amawta te da la Bienvenida',
                    //titleRightText: 'Ahora',
                    subtitle: 'Inicio Sesión',
                    text: '¡Hola,' + data.datos[0].razon_social + "!",
                    closeOnClick: true,
                });
                notificationFull.open();

                Menu_cliente();

                localStorage.setItem("CEDULA", data.datos[0].cedula);
                localStorage.setItem("NOMBRES", data.datos[0].razon_social);
                localStorage.setItem("TELEFONO", data.datos[0].telefonos);
                localStorage.setItem("EMAIL", data.datos[0].correo);
                //localStorage.setItem("PASSWORD", data.datos[0].PASSWORD);

            }else{
                app.dialog.alert('Usuario y/o password incorrectos!');
            }
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        if (console && console.log) {
            app.dialog.close();
            app.dialog.alert('¡Fallo de conexión!' + textStatus);
        }
    });
}

function validar_cedula() {
    var cad = $("#cedula").val();
    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;

    if (cad !== "" && longitud === 10) {
        for (i = 0; i < longcheck; i++) {
            if (i % 2 === 0) {
                var aux = cad.charAt(i) * 2;
                if (aux > 9) aux -= 9;
                total += aux;
            } else {
                total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
            }
        }

        total = total % 10 ? 10 - total % 10 : 0;

        if (cad.charAt(longitud - 1) == total) {
            registrarse();

        } else {
            app.dialog.alert("Cédula no valida");
        }
    } else {
        app.dialog.alert('Por favor introduzca su cédula de 10 digitos.');
    }

}

function registrarse() {
    var exp = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    //app.dialog.progress('Iniciando Registro');
    var cedula = $$('#cedula').val();
    var razon_social = $$('#nombres').val();
    var email = $$('#email').val();
    var celular = $$('#celular').val();
    var direccion = $$('#direccion').val();
    var password = $$('#pwd').val();
    var test=exp.test(password);
    if (test) {
        archivoValidacion = server+"sincronizar_usuario.php?jsoncallback=?"

        $.getJSON(archivoValidacion, {
            
            id_usuario: "-1",
            ci: cedula,
            razon_social: razon_social,
            id_institucion: "1", 
            id_rol: "4",
            correo: email,
            telefonos: celular,
            direccion: direccion,
            dato_adicional: "Aspirante registrado desde la App",
            estado: 'a',
            pass: password
        }).done(function(respuestaServer) {

            if (respuestaServer.validacion == "ok") {
                app.dialog.alert("Te has registrado correctamente.<br> Hemos enviado un mensaje a tu correo electronico.");
                app.loginScreen.close('#id_ingreso_usuario');
            } else {
                app.dialog.close();
                app.dialog.alert("Alerta: "+respuestaServer.mensaje);
            }
        }).fail(function() {
            app.dialog.close();
            app.dialog.alert("Alerta: No se puede conectar con el Servidor!!");
        })
    } else {
        app.dialog.close();
        app.dialog.alert("Su contraseña debe contener: <br> Mínimo 8 caracteres <br>Máximo 15 <br> Al menos una letra mayúscula <br> Al menos una letra minúscula <br> Al menos un dígito <br> No espacios en blanco <br>Al menos 1 carácter especial");

    }

}

function Menu_cliente() {
    $('#item_menu').show();
    var html = '<ul>';
    html += '<li>' +
        '<a href="/perfil/" onclick="CrearPerfil()" class="item-link item-content panel-close">' +
        '<i class="icon material-icons md-only">account_circle</i>' +
        '<div class="item-inner">' +
            '<div class="item-title"><strong> Perfil</strong></div>' +
        '</div>' +
        '</a>' +
        '</li>';

    html += '<li>' +
        '<a href="#" class="item-link item-content panel-close" onclick="cerrar_sesion()">' +
        '<i class="icon material-icons md-only">power_settings_new</i>' +
        '<div class="item-inner">' +
        '<div class="item-title"><strong> Cerrar sesión</strong></div>' +
        '</div>' +
        ' </a>' +
        '</li>';
    html += '</ul>';
    $('#list_menu').html("");
    $('#list_menu').append(html);
    $('#iconologin').hide();

}

function cerrar_sesion() {
    app.dialog.confirm('Estas seguro que quieres cerrar sesión?', function() {
        $('#item_menu').hide();
        $('#iconologin').show();
        localStorage.removeItem("CEDULA");
    });
}

$$(document).on('page:init', '.page[data-name="inicio"]', function(e) {
    if (localStorage.getItem("CEDULA") != undefined) {
        Menu_cliente();        
    } else {
        $('#item_menu').hide();
    }

});

function CrearPerfil() {

    $('#items_perfil').html("");
    var innerhtml = '<center><img id="imgfoto" src="img/perfil.jpg" width="120px" ></center>';

    if (localStorage.getItem("NOMBRES") != "null" )
        innerhtml += '<center><p style="font-size:.9em">' + localStorage.getItem("NOMBRES").toUpperCase() + '</p></center>';
    if (localStorage.getItem("CEDULA") != "null")
        innerhtml += '<center><p style="font-size:.9em">' + localStorage.getItem("CEDULA") + '</p></center>';
    if (localStorage.getItem("EMAIL") != "null")
        innerhtml += '<center><p style="font-size:.9em">' + localStorage.getItem("EMAIL") + '</p></center>';
    if (localStorage.getItem("TELEFONO") != "null")
        innerhtml += '<center><p style="font-size:.9em">' + localStorage.getItem("TELEFONO") + '</p></center>';
    $('#items_perfil').append(innerhtml);
}

$$(document).on('page:init', '.page[data-name="contenido_perfil"]', function(e) {
    CrearPerfil();
})