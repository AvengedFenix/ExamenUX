var ref = firebase.database().ref();

function setName() {

    document.getElementById("userNameSignedIn").innerHTML = user.displayName;
}

function submitClick() {

    var user = firebase.auth().currentUser;
    var mensaje = publicMessage.value;
    window.alert(mensaje + " Mierda para ponerme a pija");
    //ref.child("Users").child(user.uid).child("userName").set(user.displayName);
    ref.child("Mensajes").child(user.uid).child("mensajePublico").set(mensaje);
    ref.child("Usuarios").child(user.uid).child("mensajesPublicos").set();

    try {
        var privateMessages = firebase.database().ref('Users/' + user.uid + '/mensajePublico');
        if (privateMessages != null) {
            ref.child("Usuarios").child(user.uid).child("mensajesPublicos").set();

        }
    } catch (e) {

    } finally {

    }
    starCountRef.on('value', function(snapshot) {
        updateStarCount(postElement, snapshot.val());
    });
    ref.child("Usuarios").child(user.uid).child("")
}

//autentificacion INSTANCIA usuario y confirmacion de conexion
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.alert("You are signed in: " + user.displayName);
    } else {
        window.alert("You are not logged in");
    }
})

//leer de la base de datos y ponerlos en el panel muro
$(document).ready(function() {

    var messageRef = firebase.database().ref().child("Mensajes");

    messageRef.on("child_added", snap => {
        var id = snap.child("Usuarios").val();
        var message = snap.child("Mensajes").val();

        var string = "<div style='background-color: rgba(148, 105, 168, 0.788)'; class='demo-card-wide mdl-card mdl-shadow--2dp'>" +
            "<div class='mdl-card__title'>" +
            "<h2 style='color: rgba(250, 255, 255, 0.89)'; class='mdl-card__title-text'>" +
            message + "</h2></div><div style='color: rgba(250, 255, 255, 0.89)'; class='mdl-card__title-text'>" +
            id + "</div></div><p1 style='color: rgba(230, 131, 66, 0.788)';>.</p1>"
        $("#Muro").append(string

        );
    });
});