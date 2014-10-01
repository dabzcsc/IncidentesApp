/**
 * AddActivity view model
 */

var app = app || {};

app.AddActivity = (function () {
    'use strict'

    var addActivityViewModel = (function () {
        
        var $newStatus;
        var validator;
        var $fecha;
        var $descripcion;
        var $proyectos;
        
        var init = function () {
            
            validator = $('#enterStatus').kendoValidator().data('kendoValidator');
            $newStatus = $('#newStatus');
            $fecha=$('#fechaIncidentePick');
            $descripcion = $('#newStatus');
            $proyectos = $('#proyectoPick');
        };
        
        var show = function () {
            
            // Clear field on view show
            $newStatus.val('');
            validator.hideMessages();
        };
        
        var saveActivity = function () {
            var jsonObject={incidente:'{"IdIncidente":1,"IdProyecto":'+$proyectos.val()+',"Descripcion":"'+$descripcion.val()+'","FechaCreacion":"2014-09-18T00:00:00","FechaIncidente":"'+$fecha.val()+'T00:00:00","FechaSolucion":"0001-01-01T00:00:00","Estado":0,"Responsable":"David","DetalleSolucion":null,"Usuario":"'+window.localStorage.getItem("login_usuario")+'"}'};
           // app.showAlert(jsonObject.incidente,"");
            
            $.ajax({
              type: 'POST',
              url: "http://localhost:49524/Service1.asmx/AgregarIncidente",
              data: jsonObject,
              success: function(data){
                    var str=data.getElementsByTagName("boolean")[0].childNodes[0].nodeValue;
                  if(str=='true'){
                      app.showAlert("Se agregó el incidente con éxito","Exito");
                      app.Activities.reload();
                  }
                  else{
                      app.showError("No se pudo agregar el incidente");
                  }
                  
                  
                },

              async:false
           });
            
           app.mobileApp.navigate('views/activitiesView.html');
            
            
            
            
            
            

        };
        
        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
        }
        
        var poblarProyectos=function(){
           
            var pro={proyectos:[]};
             window.localStorage.setItem("proyectos",'');
            $.ajax({
              type: 'POST',
              url: "http://localhost:49524/Service1.asmx/DarProyectos",
              success: function(data){
                    var str=data.getElementsByTagName("string")[0].childNodes[0].nodeValue;
                   // app.showAlert(str,"");
                  window.localStorage.setItem("proyectos",str);
                  
                },
              async:false
           });
           var protectosStr=window.localStorage.getItem("proyectos");
           //app.showAlert(protectosStr,'');
           if(protectosStr!==''){
                 pro=JSON.parse(protectosStr);
                 var pros =pro.proyectos;
               for(var i=0;i<pros.length;i++){
                       $('#proyectoPick')
                      .append($("<option></option>")
                      .attr("value",pros[i].Id)
                      .text(pros[i].Nombre));
                 }
            }
            else{
                app.showError("Algo paso");
            }
            //app.showAlert(inc.incidentes[0].Descripcion,"")
            
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveActivity: saveActivity,
            onSelectChange: onSelectChange,
            poblarProyectos: poblarProyectos
        };
        
    }());
    
    return addActivityViewModel;
    
}());
