$$('#refresh-ptr').on('ptr:refresh', function(e) {
    app.ptr.done();
 cargarnoticias();

});


function cargarnoticias() { 
  $.ajax({
            //Cambiar a type: POST si necesario
            type: "GET",
            // Formato de datos que se espera en la respuesta
            dataType: "json",
            // URL a la que se enviará la solicitud Ajax
            url: server + "select_app_noticias.php",


        })
        .done(function(data, textStatus, jqXHR) {
            if (data.validacion=="ok") {
            
                var $ptrContent = $$('#contenido-home [id="refresh-ptr"]');
                $ptrContent.find('.list').html("");
                var itemHTML = "";
                for (var i = 0 in data.datos) {
                    if(data.datos[i].estado=="a"){
                        itemHTML = '<div class="card demo-card-header-pic" >' +
                            '<div style="background-image:url(' +server+ data.datos[i].foto + ')" class="card-header align-items-flex-end">' + data.datos[i].titulo + '</div>' +
                            '<div class="card-content card-content-padding">' +
                            '<p class="date">Publicado ' + data.datos[i].fecha + '</p>' +
                            '<p>' + data.datos[i].cuerpo.substr(0, 123) + '</p>' +
                            '</div>' +
                            //'<div class="card-footer"><a href="/noticias/" onclick="Mostrar_Noticia_entera(' + data.datos[i].id_noticias + ')" class="link">Leer más</a></div>' +
                            '</div>' +
                            '</div>' + itemHTML;
                    }
                }
                $ptrContent.find('.list').append(itemHTML);
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (console && console.log) {
                console.log("La solicitud a fallado: " + textStatus);
            }
        });
}