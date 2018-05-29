var ref = firebase.database().ref();


function initProfile(){
    var user = firebase.auth().currentUser;
    document.getElementById("profile-image1").innerHTML = user.photoURL;
    document.getElementById("fname").innerHTML = user.displayName;
    document.getElementById("email").innerHTML = user.email;
    var refUser = firebase.database().ref().child("Usuarios").child(user.uid);
    refUser.on('value', function (mensajes) {
        document.getElementById("mensajesPrivados") = mensajes.child("mensajesPrivados").val();
        document.getElementById("mensajesPublicos") = mensajes.child("mensajesPublicos").val();
    })
};

function setName(user) {

    document.getElementById("userNameSignedIn").innerHTML = user.displayName;
}


//Escribir a la base de datos
function submitClick(type) {

    var user = firebase.auth().currentUser;
    setName(user);

    var mensaje = publicMessage.value;
    window.alert("Su mensaje es: " + mensaje);

    console.log("Este es mensaje: " + mensaje);
    if (type == "mensajePublico") {
        ref.child("Mensajes").push().set({
            userName: user.displayName,
            UID: user.uid,
            mensajePublico: mensaje
        });
    } else if (type == "mensajePrivado") {
        ref.child("Mensajes").push().set({
            userName: user.displayName,
            UID: user.uid,
            mensajePublico: mensaje
        });
    }


    var counterPublic = firebase.database().ref().child("Usuarios").child(user.uid);
    var number;

    if (type == "mensajePublico") {
        contando(counterPublic,type,number);
        /*counterPublic.child("mensajesPublicos").once('value').then(function (datasnapshot) {
            number = datasnapshot.val();
            console.log("Este es number: " + number);
            //castedNumber = Number(number);
            if (number == null) {
                number = 0;
            }
            console.log("Despues de la asignación: " + number);
            counterPublic.child("mensajesPublicos").set(number + 1);
    
    
            //console.log("Numero de mensajes privados: " + castedNumber.toString());
        });*/
        printMessages();
    } else if(type == "mensajePrivado"){
        contando(counterPublic,type,number);
        /*counterPublic.child("mensajesPrivados").once('value').then(function (datasnapshot) {
            number = datasnapshot.val();
            console.log("Este es number: " + number);
            //castedNumber = Number(number);
            if (number == null) {
                number = 0;
            }
            console.log("Despues de la asignación: " + number);
            counterPublic.child("mensajesPrivados").set(number+1);
    
    
            //console.log("Numero de mensajes privados: " + castedNumber.toString());
        });*/
        printPrivateMessages();
    }
}

function contando(counterPublic, type, number){
    counterPublic.child(type).once('value').then(function (datasnapshot) {
        number = datasnapshot.val();
        console.log("Este es number: " + number);
        //castedNumber = Number(number);
        if (number == null) {
            number = 0;
        }
        console.log("Despues de la asignación: " + number);
        counterPublic.child(type).set(number+1);
        //console.log("Numero de mensajes privados: " + castedNumber.toString());
    });
}



//autentificacion INSTANCIA usuario y confirmacion de conexion
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.alert("You are signed in: " + user.displayName);
    } else {
        window.alert("You are not logged in");
    }
})

//leer de la base de datos y ponerlos en el panel muro
function printMessages() {
    document.getElementById("setMessages").innerHTML = "";
    var user = firebase.auth().currentUser;
    var refMensajes = firebase.database().ref().child("Mensajes");
    var refUser = firebase.database().ref().child("Usuarios");

    refMensajes.on("child_added", snap => {

        var name = snap.child("userName").val();
        console.log("userName: " + name);
        var mensaje = snap.child("mensajePublico").val();
        console.log("mensajePublico: " + mensaje);
        var guestUser = snap.child("UID").val();
        console.log("Este es guest user: " + guestUser);
        
        var refUser = firebase.database().ref().child("Usuarios").child(guestUser).child("Photo URL");
        var temp;
        refUser.on('value', function (laFoto) {
            var guestPhoto;
            //var temp = laFoto.val();
            //console.log("Este es temp: " + temp);
            
            guestPhoto = laFoto.val();
            temp = guestPhoto;
            console.log("temp: " + temp);
        
            console.log("Photo URL: " + temp);
            var content = "<br><br><div class='card' style='width: 18rem;'>" +
                "<img class='card-img-top' src='" + temp + "' alt='Card image cap'>" +
                "<div class='card-body'>" +
                "<h5 class='card-title'> Post Title </h5> " +
                "<p class='card-text'>" + mensaje + "</p>" +
                "<br> <p class='card-text'>" + name + "</p> </div></div>"
            $("#setMessages").append(content);
        })
    })

};

function printPrivateMessages() {
    document.getElementById("setPrivateMessages").innerHTML = "";
    var user = firebase.auth().currentUser;
    var refMensajes = firebase.database().ref().child("Mensajes");
    var refUser = firebase.database().ref().child("Usuarios");

    refMensajes.on("child_added", snap => {

        var name = snap.child("userName").val();
        console.log("userName: " + name);
        var mensaje = snap.child("mensajePrivado").val();
        console.log("mensajePrivado: " + mensaje);
        var guestUser = snap.child("UID").val();
        var refUser = firebase.database().ref().child("Usuarios").child(guestUser).child("Photo URL");
        var guestPhoto;
        refUser.on('value', function (laFoto) {
            guestPhoto = laFoto.val();
            console.log("Photo URL: " + guestPhoto);
            var content = "<br><br><div class='card' style='width: 18rem;'>" +
                "<img class='card-img-top' src='" + guestPhoto + "' alt='Card image cap'>" +
                "<div class='card-body'>" +
                "<h5 class='card-title'> Post Title </h5> " +
                "<p class='card-text'>" + mensaje + "</p>" +
                "<br> <p class='card-text'>" + name + "</p> </div></div>"
            $("#setPrivateMessages").append(content);
        })

    })
};