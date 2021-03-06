/**
 * Activities view model
 */

var app = app || {};

app.Activities = (function () {
    'use strict'

    // Activities model
    var activitiesModel = (function () {

        var activityModel = {

            id: 'IdIncidente',
            fields: {
                IdProyecto: {
                    field: 'IdProyecto',
                    defaultValue: ''
                },
                Descripcion: {
                    field: 'Descripcion',
                    defaultValue: ''
                },
                FechaCreacion: {
                    fields: 'FechaCreacion',
                    defaultValue: new Date()
                },
                FechaIncidente: {
                    field: 'FechaIncidente',
                    defaultValue: null
                },
                FechaSolucion: {
                    field: 'FechaSolucion',
                    defaultValue: null
                },
                 Estado: {
                    field: 'Estado',
                    defaultValue: 0
                },
                 Responsable: {
                    field: 'Responsable',
                    defaultValue: ''
                },
                 DetalleSolucion: {
                    field: 'DetalleSolucion',
                    defaultValue: ''
                },
                 Usuario: {
                    field: 'Usuario',
                    defaultValue: ''
                },
                 NombreProyecto: {
                    field: 'NombreProyecto',
                    defaultValue: ''
                }
            },
            CreatedAtFormatted: function () {

                //return app.helper.formatDate(this.get('FechaIncidente').substring(0,10));
                return this.get('FechaIncidente').substring(0,10);
            },
            FechaSolucionFormatted: function () {
                 if(this.get('Estado')==0){
                    return "Sin solución";
                }
                else{
                    return app.helper.formatDate(this.get('FechaSolucion'));
                }
            },
            FechaCreacionnFormatted: function () {

                return app.helper.formatDate(this.get('FechaCreacion'));
            },
            EstadoFormatted: function () {
                if(this.get('Estado')==0){
                    return "Sin solución";
                }
                else{
                    return "Solucionado!";
                }
            },
            ResponsableFormatted: function () {
                if(this.get('Responsable')!=null){
                    return this.get('Responsable');
                }
                else{
                    return "Sin responsable aun.";
                }
            },
            DetalleFormatted: function () {
                if(this.get('Estado')==0){
                    return "Sin solución";
                }
                else{
                    return this.get('DetalleSolucion');
                }
            },
            isVisible: function () {
              

                return true;
            }
        };

        var darIncidentes=function(){
            var jsonObject={usuario:window.localStorage.getItem("login_usuario")};
            var inc={incidentes:[]};
            window.localStorage.setItem("incidentes",'');
            $.ajax({
              type: 'POST',
              url: app.webservice+"DarIncidentesPorUsuario",
              data: jsonObject,
              success: function(data){
                    var str=data.getElementsByTagName("string")[0].childNodes[0].nodeValue;
                   // app.showAlert(str,"");
                  window.localStorage.setItem("incidentes",str);
                  
                },

              async:false
           });
           var incidentesStr=window.localStorage.getItem("incidentes");
           if(incidentesStr!==''){
                      inc=JSON.parse(incidentesStr);
                      //app.showAlert(window.localStorage.getItem("login_usuario")+"TODO BN","");
                  }
                  else{
                      app.showError("Algo paso");
                  }
            //app.showAlert("pidio","")
            return inc;
        }
        
        
        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var activitiesDataSource = new kendo.data.DataSource({
            transport: {
                read: function(options){

                    var inc =darIncidentes();
                    
                    options.success(inc); 
                }
            },
            schema: {
                data: "incidentes",
                model: activityModel
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                } else {
                    $('#no-activities-span').show();
                }
            
            }
            });
        
        var reloadDataSource=function(){
            activitiesDataSource.read();
        }

        return {
            activities: activitiesDataSource,
            reloadDataSource: reloadDataSource
        };

    }());

    // Activities view model
    var activitiesViewModel = (function () {

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {
            //app.showAlert(e.data.IdIncidente,"")
            app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {
            navigator.notification.confirm('Realmente desea salir?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
                window.localStorage.clear();
                exit();
            }
        }, 'Salir', ['OK', 'Cancelar']);
            
        };

        return {
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout,
            reload:activitiesModel.reloadDataSource
        };

    }());

    return activitiesViewModel;

}());
