/**
 * AddActivity view model
 */

var app = app || {};

app.AddComment = (function () {
    'use strict'

    var AddCommentViewModel = (function () {
        
        var $newComment;
        var validator;
        var $fecha;
        var $descripcion;
        var $proyectos;
        var incidente;
        
        var init = function () {
            incidente=app.Activity.activity();
            validator = $('#enterComment').kendoValidator().data('kendoValidator');
            $fecha=$('#fechaIncidentePickEdit');
            $fecha.mobiscroll().date({
                invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
                theme: 'jqm',
                //display: 'inline',
                //mode: 'scroller',
                dateOrder: 'dd mm yy',
                dateFormat : "yyyy-mm-dd",
                lang: 'es'

            });  
            //$fecha.mobiscroll('setDate',incidente.FechaIncidente.substring(0,10), true);
            $descripcion = $('#newStatusEdit');
            $proyectos = $('#proyectoPickEdit');
            poblarProyectos();
        };
        
        var show = function () {
            
            // Clear field on view show
            validator.hideMessages();
            $descripcion.val(incidente.Descripcion);
            $fecha.val(incidente.FechaIncidente.substring(0,10));
            $proyectos.val(incidente.IdProyecto);
            
        };
        
        var poblarProyectos=function(){
           
            var pro={proyectos:[]};
             window.localStorage.setItem("proyectos",'');
            $.ajax({
              type: 'POST',
              url: app.webservice+"DarProyectos",
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
                       $('#proyectoPickEdit')
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
        
        var saveComment = function () {
            //app.showAlert(incidente.IdIncidente,'')
            var jsonObject;
            if(incidente.Responsable!=null){
                if(incidente.Estado==0){
                    jsonObject={incidente:'{"IdIncidente":'+incidente.IdIncidente+',"IdProyecto":'+$proyectos.val()+',"Descripcion":"'+$descripcion.val()+'","FechaCreacion":"'+incidente.FechaCreacion+'","FechaIncidente":"'+$fecha.val()+'T00:00:01","FechaSolucion":"'+incidente.FechaSolucion+'","Estado":'+incidente.Estado+',"Responsable":"'+incidente.Responsable+'","DetalleSolucion":null,"Usuario":"'+window.localStorage.getItem("login_usuario")+'"}'};
                }
                else{
                    jsonObject={incidente:'{"IdIncidente":'+incidente.IdIncidente+',"IdProyecto":'+$proyectos.val()+',"Descripcion":"'+$descripcion.val()+'","FechaCreacion":"'+incidente.FechaCreacion+'","FechaIncidente":"'+$fecha.val()+'T00:00:01","FechaSolucion":"'+incidente.FechaSolucion+'","Estado":'+incidente.Estado+',"Responsable":"'+incidente.Responsable+'","DetalleSolucion":"'+incidente.DetalleSolucion+'","Usuario":"'+window.localStorage.getItem("login_usuario")+'"}'};
                }
            }
            else{
                jsonObject={incidente:'{"IdIncidente":'+incidente.IdIncidente+',"IdProyecto":'+$proyectos.val()+',"Descripcion":"'+$descripcion.val()+'","FechaCreacion":"'+incidente.FechaCreacion+'","FechaIncidente":"'+$fecha.val()+'T00:00:01","FechaSolucion":"'+incidente.FechaSolucion+'","Estado":'+incidente.Estado+',"Responsable":null,"DetalleSolucion":null,"Usuario":"'+window.localStorage.getItem("login_usuario")+'"}'};

            }
            app.showAlert(jsonObject.incidente,"");
            
            
            $.ajax({
              type: 'POST',
              url: app.webservice+"ModificarIncidente",
              data: jsonObject,
              success: function(data){
                 app.Activities.reload();
                 app.showAlert("Se editó el incidente con éxito","Exito");
                  
                  
                },

              async:false
           });
            
           app.mobileApp.navigate('views/activitiesView.html');
    
            

        };
        
        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
        }
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveComment: saveComment,
            poblarProyectos: poblarProyectos,
            onSelectChange: onSelectChange
        };
        
    }());
    
    return AddCommentViewModel;
    
}());
