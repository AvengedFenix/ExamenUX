var ref = firebase.database().ref();


function setName(user) {

    document.getElementById("userNameSignedIn").innerHTML = user.displayName;
}


//Escribir a la base de datos
function submitClick() {

    var user = firebase.auth().currentUser;
    setName(user);

    var mensaje = publicMessage.value;
    window.alert(mensaje + " mierda para ponerme a pija");
    //ref.child("Users").child(user.uid).child("userName").set(user.displayName);
    /*ref.child("Mensajes").push().child("mensajePublico").set(mensaje);
    ref.child("Mensajes").push().child("UID").set(user.uid);*/
    //var textMessage = document.getElementById("publicMessage");
    //console.log("Este es textMessage: " + textMessage);
    console.log("Este es mensaje: " + mensaje);
    ref.child("Mensajes").push().set({
        userName: user.displayName,
        UID: user.uid,
        mensajePublico: mensaje
    });

    var counterPublic = firebase.database().ref().child("Usuarios").child(user.uid).child("mensajesPublicos");

    counterPublic.on('value', function(datasnapshot) {
        var number = datasnapshot.val();
        console.log("Este es number: " + number);
        castedNumber = Number(number);
        if (isNaN(castedNumber)) {
            castedNumber = 0;
        } else {
            console.log("Despues de la asignación: " + castedNumber);
            castedNumber += 1;
        }

        console.log("Numero de mensajes publicos: " + castedNumber.toString());
        counterPublic.set(castedNumber.toString());
    })

    printMessages();
    //ref.child("Usuarios").child(user.uid).child("mensajesPublicos").set();

    /*try {
        var privateMessages = firebase.database().ref('Users/' + user.uid + '/mensajePublico');
        console.log("privateMessages: " + privateMessages);
        if (privateMessages != null) {
            ref.child("Usuarios").child(user.uid).child("mensajesPublicos").set();
            privateMessages.on('value', function(snapshot) {
                updatemensajesPublicos(postElement, snapshot.val());
            });
        }
    } catch (e) {
        console.log("Error: ", e.stack);
        console.log("Error: ", e.name);
        console.log("Error: ", e.message);
    } finally {

    }*/
}
//ref.child("Usuarios").child(user.uid).child("")


//autentificacion INSTANCIA usuario y confirmacion de conexion
firebase.auth().onAuthStateChanged(function(user) {
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
        var refUser = firebase.database().ref().child("Usuarios").child(guestUser).child("Photo URL");
        var guestPhoto;
        refUser.on('value', function(laFoto) {
            guestPhoto = laFoto.val();

        })
        console.log("Photo URL: " + guestPhoto);
        var content = "<br><br><div class='card' style='width: 18rem;'>" +
            "<img class='card-img-top' src='" + guestPhoto + "' alt='Card image cap'>" +
            "<div class='card-body'>" +
            "<h5 class='card-title'> Post Title </h5> " +
            "<p class='card-text'>" + mensaje + "</p>" +
            "<br> <p class='card-text'>" + name + "</p> </div></div>"
        $("#setMessages").append(content);
    })
};