function nuevaOferta() {
    cordova.plugins.barcodeScanner.scan(
        function(result) {
            if(result.text!=""){
                id_institucion = result.text;
                //app.dialog.alert("Codigo:"+ "\n" +result.text);
                $.ajax({
                    data: { "id_institucion": id_institucion },
                    //Cambiar a type: POST si necesario
                    type: "GET",
                    // Formato de datos que se espera en la respuesta
                    dataType: "json",
                    // URL a la que se enviará la solicitud Ajax
                    url: server + "select_app_archivos.php",


                })
                .done(function(data, textStatus, jqXHR) {
                    if (data.validacion=="ok") {
                        var html = "<li>UNIANDES</li>";
                        $("#select-demo").html(html);
                        for (var i = 0 in data.datos) {
                            var ruta_archivo = data.datos[i].ruta;
                            //$("#select-nuevos").append(html);
                            var extension = ruta_archivo.substring(ruta_archivo.lastIndexOf("."));
                            if (extension == ".jpg" || extension == ".png"){
                                html = '<div class="block block-strong">'+
                                        '<div class="block-header">Imagen</div>'+
                                        '<img src="'+server+ruta_archivo+'" width="100%" />'+
                                        '<div class="block-footer"><span class="badge" onclick="downloadFile('+"'"+server+ruta_archivo+"'"+');">Descargar</span></div>'+
                                    '</div>';
                            }
                            if(extension == ".mp4"){
                                html = '<div class="block block-strong">'+
                                        '<div class="block-header">Video</div>'+
                                        '<video width="100%" controls>'+
                                          '<source src="'+server+ruta_archivo+'" type="video/mp4">'+
                                        '</video>'+
                                        '<div class="block-footer"><span class="badge" onclick="downloadFile('+"'"+server+ruta_archivo+"'"+');">Descargar</span></div>'+
                                    '</div>';
                            }
                            $("#select-demo").append(html);
                        }
                    }else{
                        app.dialog.alert(data.mensaje);
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    app.dialog.alert("La solicitud a fallado: " + textStatus);
                });
            }else{
                app.dialog.alert("Proceso cancelado");
            }
        },
        function(error) {
            alert("Scanning failed: " + error);
        }, {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Coloque el objetivo en el codigo QR", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );
}

function listPath(myPath){
    $("#select-demo").html("");
    /*window.resolveLocalFileSystemURL(myPath+'Documents/', function (dirEntry1) {
        var isAppend = true;
        //createFile(dirEntry1, "fileToAppend.txt", isAppend);
        dirEntry1.getFile("fileToAppend.txt", {create:isAppend}, function(fileEntry) {
            $("#select-demo").append('<li> The file has been succesfully created. Use fileEntry to read the content or delete the file</li>');
                // The file has been succesfully created. Use fileEntry to read the content or delete the file
        });
    }, onFailCallback);*/
    
    window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(onSuccessCallback,onFailCallback);
    });

    function onSuccessCallback(entries){
        for (i=0; i<entries.length; i++) {
            var row = entries[i];
            var html = '';         

            if(row.isDirectory){
                //Dibujar una carpeta y al darle click, renderizará el contenido de esta nuevamente
                html = '<div class="item-content" onclick="listPath('+"'"+row.nativeURL+"'"+');">'+
                        '<div class="item-inner">'+
                          '<div class="item-title">'+row.name+'</div>'+
                          '<div class="item-after"><span class="badge">Carpeta</span></div>'+
                        '</div>'+
                      '</div>';
            }else{
                // alertar el path del archivo.
                var nombre_archivo = row.name;
                var extension = nombre_archivo.substring(nombre_archivo.lastIndexOf("."));
                if (extension == ".jpg" || extension == ".png"){
                    html = '<div class="block block-strong">'+
                            '<div class="block-header">Imagen</div>'+
                            '<img src="'+row.nativeURL+'" width="100%" />'+
                            '<div class="block-footer"><span class="badge">Imagen Local</span></div>'+
                        '</div>';
                }
                if(extension == ".mp4"){
                    html = '<div class="block block-strong">'+
                            '<div class="block-header">Video</div>'+
                            '<video width="100%" controls>'+
                              '<source src="'+row.nativeURL+'" type="video/mp4">'+
                            '</video>'+
                            '<div class="block-footer"><span class="badge">Video Local</span></div>'+
                        '</div>';
                }
            }
            $("#select-demo").append(html);
        }
        //document.getElementById("").innerHTML = html;
    }

    function onFailCallback(e){
        console.error(e);
        app.dialog.alert(e);
        // Mostrar informacion de error en la consola
    }
}

//Funciones
function getFilepath(fileEntry){
    app.dialog.alert(fileEntry);
}


var folderName = 'Download';
var fileName;

function downloadFile(URL) {
    //step to request a file system 
    if(localStorage.getItem("CEDULA")==null){
        app.dialog.alert("Lo sentimos, debes estar logeado para descargar");
    }else{
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

        function fileSystemSuccess(fileSystem) {
            var download_link = encodeURI(URL);
            fileName = download_link.substr(download_link.lastIndexOf('/') + 1); //Get filename of URL
            var directoryEntry = fileSystem.root; // to get root path of directory
            directoryEntry.getDirectory(folderName, {
                create: true,
                exclusive: false
            }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
            var rootdir = fileSystem.root;
            var fp = fileSystem.root.toNativeURL(); // Returns Fullpath of local directory

            fp = fp + "/" + folderName + "/" + fileName; // fullpath and name of the file which we want to give
            // download function call
            filetransfer(download_link, fp);
        }

        function onDirectorySuccess(parent) {
            // Directory created successfuly
        }

        function onDirectoryFail(error) {
            //Error while creating directory
            app.dialog.alert("Unable to create new directory: " + error.code);

        }

        function fileSystemFail(evt) {
            //Unable to access file system
            app.dialog.alert(evt.target.error.code);
        }
    }
    
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    fileTransfer.download(download_link, fp,
        function(entry) {
            app.dialog.alert("Descarga completa: " + entry.fullPath);
        },
        function(error) {
            //Download abort errors or download failed errors
            app.dialog.alert("Algo paso al descargar " + error.source);
        }
    );
}