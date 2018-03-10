'use strict';

angular.module('promotorApp')
       .service('provinciasDataSvc', [function(){

         this.provincias = [
                  {"id": "01", "name": "Alava"},
                  {"id": "02", "name": "Albacete"},
                  {"id": "03", "name": "Alicante"},
                  {"id": "04", "name": "Almería"},
                  {"id": "05", "name": "Ávila"},
                  {"id": "06", "name": "Badajoz"},
                  {"id": "07", "name": "Islas Baleares"},
                  {"id": "08", "name": "Barcelona"},
                  {"id": "09", "name": "Burgos"},
                  {"id": "10", "name": "Cáceres"},
                  {"id": "11", "name": "Cádiz"},
                  {"id": "12", "name": "Castellón"},
                  {"id": "13", "name": "Ciudad Real"},
                  {"id": "14", "name": "Córdoba"},
                  {"id": "15", "name": "La Coruña"},
                  {"id": "16", "name": "Cuenca"},
                  {"id": "17", "name": "Gerona"},
                  {"id": "18", "name": "Granada"},
                  {"id": "19", "name": "Guadalajara"},
                  {"id": "20", "name": "Guipúzcoa"},
                  {"id": "21", "name": "Huelva"},
                  {"id": "22", "name": "Huesca"},
                  {"id": "23", "name": "Jaén"},
                  {"id": "24", "name": "León"},
                  {"id": "25", "name": "Lérida"},
                  {"id": "26", "name": "La Rioja"},
                  {"id": "27", "name": "Lugo"},
                  {"id": "28", "name": "Madrid"},
                  {"id": "29", "name": "Málaga"},
                  {"id": "30", "name": "Murcia"},
                  {"id": "31", "name": "Navarra"},
                  {"id": "32", "name": "Orense"},
                  {"id": "33", "name": "Asturias"},
                  {"id": "34", "name": "Palencia"},
                  {"id": "35", "name": "Las Palmas"},
                  {"id": "36", "name": "Pontevedra"},
                  {"id": "37", "name": "Salamanca"},
                  {"id": "38", "name": "Santa Cruz de Tenerife"},
                  {"id": "39", "name": "Salamanca"},
                  {"id": "40", "name": "Segovia"},
                  {"id": "41", "name": "Sevilla"},
                  {"id": "42", "name": "Soria"},
                  {"id": "43", "name": "Tarragona"},
                  {"id": "44", "name": "Teruel"},
                  {"id": "45", "name": "Toledo"},
                  {"id": "46", "name": "Valencia"},
                  {"id": "47", "name": "Valladolid"},
                  {"id": "48", "name": "Vizcaya"},
                  {"id": "49", "name": "Zamora"},
                  {"id": "50", "name": "Zaragoza"},
                  {"id": "51", "name": "Ceuta"},
                  {"id": "52", "name": "Melilla"}
              ];

       }
  ]
);