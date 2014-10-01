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
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new activity to Activities model
                var activities = app.Activities.activities;
                var activity = activities.add();
                
                activity.Text = $newStatus.val();
                activity.UserId = app.Users.currentUser.get('data').Id;
                
                activities.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                activities.sync();
            }
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
           app.showAlert(protectosStr,'');
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
