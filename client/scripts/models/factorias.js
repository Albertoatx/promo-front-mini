'use strict';
//angular.module('promotorApp.factorias', [])
angular.module('promotorApp')

    //Ya que vamos a tratar con datos usando un servicio web en el backend (usando nuestra api definida en "api.js"), creamos factorias para 
    //comunicarnos con dicho servicio web en el backend. 
    //Por tanto aquí crearemos nuestros servicios factoria que harán las operaciones CRUD
    //Ver esta factoria como una API en el frontend para comunicarse con nuestra API definida en el backend con ExpressJS
    // (Normalmente se define 1 funcionalidad en el front para cada funcionalidad en el backend haciendo una petición a la ruta ExpressJS apropiada)
    //NOTA: Los controladores de Angular serán quienes trabajen con estas factorias que definimos aqui.
    .factory('promotoresFactory', ['$http', '$q',
        function ($http, $q) {

            // Sin salida a Internet esta instruccion google = undefined ya que no ha podido descargar el script
            //   y esto tenia como efecto secundario que no se recuperasen los promotores
            // var geocoder = new google.maps.Geocoder();  
            // var coordenadas = {'latitud':0.0, 'longitud':0.0};

            var baseUrlForCoordenates = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
            var keyApi = 'AIzaSyAYPE5eUENmWQ4ci3EkbTBR3C1c45qb9tA';

            var self = this;
            self.promotores = null;

            return {

                //PROMOTORES *********************************************************************************
                //$http devuelve una promesa
                getPromotores: function () {
                    //OLD VERSION
                    return $http.get('/api/promotores');  //Llama al servicio web REST del backend encargado de atender la ruta "/api/pages"

                    //NEW VERSION (uses $q to cached data)
                    /*
                    // Create a deferred operation.
                    var deferred = $q.defer();
                    
                    // If we already have the list of promoters (CACHED), we can resolve the promise.
                    if(self.promotores !== null) {
                        console.log("(from Cache!)" + self.promotores);
                        deferred.resolve(self.promotores);
                    } else {
                        // Get promoters from the server.
                        $http.get('/api/promotores')
                          .then(function(response) {
                            self.promotores = response.data;
                            console.log("(from Server!)" + self.promotores);
                            deferred.resolve(self.promotores);
                          },function(error) {
                            deferred.reject(error);
                          });
                    }
 
                    return deferred.promise; //return the promise we've built with deferred
                    */
                },
                savePromotor: function (promotorData) {
                    return $http.post('/api/promotores/add', promotorData);
                },
                detailPromotor: function (id) {
                    return $http.get('/api/promotores/' + id);
                },
                editPromotor: function (id, promotorData) {
                    return $http.put('/api/promotores/' + id, promotorData);
                },
                deletePromotor: function (id) {
                    return $http.delete('/api/promotores/' + id);
                },
                misPromotores: function (username) {
                    return $http.get('/api/mispromotores/' + username);
                },

                //OBRAS *************************************************************************************
                getObrasAll: function () {
                    return $http.get('/api/promociones');
                },
                getObrasPromotor: function (id) {
                    return $http.get('/api/promociones/' + id);
                },
                saveObra: function (id, obraData) {
                    return $http.post('/api/promociones/add/' + id, obraData);
                },
                detailObra: function (id, codObra) {
                    return $http.get('/api/promociones/' + id + '/' + codObra);
                },
                editObra: function (id, codObra, obraData) {
                    return $http.put('/api/promociones/' + id + '/' + codObra, obraData);
                },  //Ojo, es POST porque el borrado NO es de todo el documento, solo de 1 elemento embebido 
                deleteObra: function (id, codObra) {
                    return $http.post('/api/promociones/' + id + '/' + codObra);
                },

                //Look for coordinates to later use in Google Maps ----------------------
                getLatitudLongitud: function (address) {

                    var coord = { 'latitud': 0, 'longitud': 0 };
                    var fullUrl = baseUrlForCoordenates + address + '&key=' + keyApi;
                    //alert("fullUrl para obtener coordenadas " + fullUrl);

                    //El servicio trata la promesa (haga la logica que pueda usar cualquier controlador) 
                    return $http.get(fullUrl)
                        .then(
                        function (response) {
                            coord.latitud = response.data.results[0].geometry.location.lat;
                            coord.longitud = response.data.results[0].geometry.location.lng;

                            return coord;
                        } //Si hay error que lo capture el .catch de la ultima promesa
                        /*
                        ,
                        function (err) {
                            console.log("Error al intentar conseguir las coordenadas");
                        } */
                        );

                },
                //GOOGLE MAPS **********************************************************************************
                initMap: function (coordenates, promotorData) {

                    //console.log(promotorData);

                    if (coordenates && coordenates.latitud !== 0 && coordenates.longitud !== 0) {

                        // Map options
                        var options = {
                            zoom: 15,
                            center: { lat: coordenates.latitud, lng: coordenates.longitud }
                        }

                        // New map
                        var map = new google.maps.Map(document.getElementById('map'), options);

                        // OPT1 to prevent showing a gray map: 
                        // Wait for map's 'idle' state (i.e. when it's finished) to trigger event 'resize' on the map                        
                        //google.maps.event.addListenerOnce(map, 'idle', {passive: true}, function () {
                        google.maps.event.addListenerOnce(map, 'idle', function () {
                            var currentCenter = map.getCenter();
                            google.maps.event.trigger(map, 'resize');
                            map.setCenter(currentCenter);
                        }); 

                        // OPT2 to prevent showing a gray map: 
                        /* dispatch a 'resize' event for the window
                        setTimeout(function () {
                            window.dispatchEvent(new Event("resize"));
                        }, 1);
                        */

                        // Listen for click on map and put a marker (I DON'T NEED THIS! )
                        /*
                        google.maps.event.addListener(map, 'click', function(event){
                            addMarker({coords:event.latLng}); // Add marker
                        }); */

                        // Array of markers ---------------
                        var markers = [
                            {
                                coords: { lat: coordenates.latitud, lng: coordenates.longitud },
                                content: `<h3>Promotor: ${promotorData.nombrep}</h3>
                                    <p>  email: ${promotorData.emailp}  </p> 
                                    <p>  calle: ${promotorData.direcp.callep}</p>
                                    <p>  localidad: ${promotorData.direcp.pueblo} 
                                        (${promotorData.direcp.codpostal})
                                    </p> 
                                    <p>  provincia: ${promotorData.direcp.provincia}</p> 
                                    `
                            }
                        ];

                        // Loop through markers -------------
                        for (var i = 0; i < markers.length; i++) {
                            // Add marker
                            addMarker(markers[i]);
                        }

                        // Add Marker Function ---------------
                        function addMarker(props) {

                            var marker = new google.maps.Marker({
                                position: props.coords,
                                map: map,
                            });

                            // Check for custom icon
                            if (props.iconImage) {
                                marker.setIcon(props.iconImage); // Set icon image
                            }

                            // Check for content
                            if (props.content) {

                                var infoWindow = new google.maps.InfoWindow({
                                    content: props.content
                                });

                                //listen for a click in the Google Map window
                                marker.addListener('click', function () {
                                    infoWindow.open(map, marker);
                                });
                            }
                        } // function addMarker

                    } //end IF

                }, //function initGoogleMap(){

                /*
                getMaps: function (address) {
                    //return $http.get(address); 

                    var geocoder = new google.maps.Geocoder();
                    var coordenadas = { 'latitud': 0.0, 'longitud': 0.0 };


                    geocoder.geocode({ 'address': address }, function (results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log('Resultados en la fatoria de la función getMaps');
                            console.log(results[0].geometry);
                            var latitud = results[0].geometry.location.lat();
                            var longitud = results[0].geometry.location.lng();
                            coordenadas.latitud = results[0].geometry.location.lat();
                            coordenadas.longitud = results[0].geometry.location.lng();
                        }
                        else {
                            alert("Geocode was not successful for the following reason: " + status);
                        }
                    });
                },
                getGeocoder: function () {
                    return geocoder;
                },
                getCoordenadas: function () {
                    return coordenadas;
                },*/
            };
        }
    ])
    //Creamos una factoria (proporcionará una API en el front) para la autenticacion que comunica con la ruta del backend
    .factory('authFactory', ['$http', '$rootScope', '$location', '$q', "$route", 
        function ($http, $rootScope, $location, $q, $route) {
            return {
                saveUser: function (userData) {
                    return $http.post('/auth/signup', userData);
                },
                login: function (credentials) {
                    //Llama al servicio web REST del backend encargado de atender la ruta "/api/login"
                    return $http.post('/auth/login', credentials);
                },
                logout: function () {
                    return $http.get('/auth/logout'); //Se llamara desde el punto de entrada "appback.js" ya que no tiene vista/controlador
                },                                     //asociado y debe poderse cerrar sesion desde cualquier punto de la app
                detailUser: function (username) {
                    return $http.get('/auth/users/' + username);
                },
                editUser: function (id, userData) {
                    return $http.put('/auth/users/' + id, userData);
                },
                getUsers: function () {
                    return $http.get('/auth/users');
                },
                deleteUser: function (id) {
                    return $http.delete('/auth/users/' + id);
                },
                renewPassword: function (data) {
                    return $http.post('/auth/newpassword', data);
                },
                isLoggedIn: function () {
                    return $http.get('/auth/sessionUsername');
                },
                //He inyectado el $rootscope y $location para poder usarlos desde la factoria
                //PROBLEMA: Aunque no permita ir a la ruta si que sigue haciendo peticion http y consultando datos
                /*
                checkPermissions: function () {
                    if ($rootScope.authenticated === true) {
                        console.log("User has permissions");
                    } else {
                        alert("You don't have access here! You must log in before");
                        $location.path('user/login');
                    }
                },
                checkUserRole: function () {
                        console.log("Entre en metodo checkUserRole");
                        console.log("current user: "  + $rootScope.current_user);
                        console.log("administrator: " + $rootScope.administrator);
                        console.log("authenticated: " + $rootScope.authenticated);

                    if ($rootScope.authenticated === true && 
                        $rootScope.administrator === true) {
                        console.log("User has permissions");
                    } else if ($rootScope.authenticated === true) {
                        alert("You don't have access here! Your user does NOT have admin privileges");
                        $location.path('/promotores');
                    } else {
                        alert("You don't have access here! You must log in with admin privileges");
                        $location.path('user/login');
                    }
                }, */
                checkAccess: function (){
                    /*
                    console.log("Entra en metodo checkAcess");
                    console.log("current user: "  + $rootScope.current_user);
                    console.log("administrator: " + $rootScope.administrator);
                    console.log("authenticated: " + $rootScope.authenticated);
                    console.log("-----------------------------------------------");
                    */

                    // Create a deferred operation (this object contains the promise we'll return)
                    var deferred = $q.defer(); 

                    //Call 'resolve' on a deferred object to complete it successfully, 
                    //Call 'reject' to fail it with an error.
                    if ($rootScope.authenticated) {
                        //console.log("El usuario ha entrado en el sistema y puede consultar esta ruta");
                        deferred.resolve();
                    } else {
                        alert("¡No tienes permisos para acceder aquí! Antes debes entrar en el sistema");
                        deferred.reject();
                        $location.path('user/login');
                    }

                    return deferred.promise; //Return the promise
                },
                checkAccessWithUser: function (){
                    // Create a deferred operation (this object contains the promise we'll return)
                    var deferred = $q.defer(); 
                    //console.log("username en checkAccessWithUser" +  $route.current.params);

                    if (!$rootScope.authenticated) {
                        alert("¡No tienes permisos para acceder aquí! Antes debes entrar en el sistema");
                        deferred.reject();
                        $location.path('user/login');
                    } else if ($rootScope.current_user !== $route.current.params.username &&
                               $rootScope.current_user !== 'admin') {
                        alert("¡No tienes permisos para acceder a otro perfil de usuario! Le redirigimos al suyo");
                        deferred.reject();
                        $location.path('/user/' + $rootScope.current_user);
                    } else {
                        //console.log("El usuario ha accedido correctamente a los datos de su perfil");
                        deferred.resolve();
                    }

                    return deferred.promise;  //Return the promise
                },
                checkAccessWithRole: function (){
                    /*
                    console.log("Entra en metodo checkAccessWithRole (admin)");
                    console.log("current user: "  + $rootScope.current_user);
                    console.log("administrator: " + $rootScope.administrator);
                    console.log("authenticated: " + $rootScope.authenticated);
                    console.log("-----------------------------------------------");
                    */

                    // Create a deferred operation (this object contains the promise we'll return)
                    var deferred = $q.defer(); 

                    if ($rootScope.authenticated && $rootScope.administrator) {
                        //console.log("El usuario ha entrado en el sistema y tiene permisos para consultar esta ruta");
                        deferred.resolve();
                    } else if ($rootScope.authenticated) {
                        alert("No tienes permisos para acceder aquí: son necesarios permisos de administrador");
                        deferred.reject();
                        $location.path('/');  //Evitar asi que en 2ª peticion a misma http salga de la app                       
                    } else {
                        alert("¡No tienes permisos para acceder aquí! Antes debes entrar en el sistema como administrador");
                        deferred.reject();
                        $location.path('user/login');
                    }

                    return deferred.promise; //Return the promise
                }
            };

        }
    ]);
