/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {

        var isInMistSimulator = (location.host.indexOf('icenium.com') > -1);

        var $loginUsername;
        var $loginPassword;

        var init = function () {

          
            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');

          
        };

        var show = function () {
            $loginUsername.val('');
            $loginPassword.val('');
        };

        // Authenticate to use Backend Services as a particular user
        var login = function () {

            var username = $loginUsername.val();
            var password = $loginPassword.val();

            var jsonObject={usuario:username,password:password};
            $.ajax({
              type: 'POST',
              url: app.webservice+"Login",
              data: jsonObject,
              success: function(data){
                    var str=data.getElementsByTagName("string")[0].childNodes[0].nodeValue;
                   // app.showAlert(str,"");
                  var usu=JSON.parse(str);
                  if(str!=='null'){
                      window.localStorage.clear();
                      window.localStorage.setItem("login_usuario",usu.Login);
                      window.localStorage.setItem("nombre_usuario",usu.Nombre+ " "+usu.Apellido);
                      app.mobileApp.navigate('views/activitiesView.html');
                     // app.showAlert(window.localStorage.getItem("login_usuario"),"")
                  }
                  else{
                      app.showError("Usuario y contraseña invalida");
                  }
                },

              async:false
           });
            
            
            
            
            

        };


       

        return {
            init: init,
            show: show,
            getYear: app.getYear,
            login: login
        };

    }());

    return loginViewModel;

}());
