/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * FirebaseUI initialization to be used in a Single Page application context.
 */

/**
 * @return {!Object} The FirebaseUI config.
 */
function getUiConfig() {
    return {
        'callbacks': {
            // Called when the user has been successfully signed in.
            'signInSuccessWithAuthResult': function (authResult, redirectUrl) {
                if (authResult.user) {
                    handleSignedInUser(authResult.user);
                }
                if (authResult.additionalUserInfo) {
                    document.getElementById('is-new-user').textContent =
                        authResult.additionalUserInfo.isNewUser ?
                            'New User' : 'Existing User';
                }
                // Do not redirect.
                return false;
            }
        },
        // Opens IDP Providers sign-in flow in a popup.
        'signInFlow': 'popup',
        'signInOptions': [
            // TODO(developer): Remove the providers you don't need for your app.
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // Required to enable this provider in One-Tap Sign-up.
                authMethod: 'https://accounts.google.com',
                // Required to enable ID token credentials for this provider.
                clientId: CLIENT_ID
            }

        ],
        // Terms of service url.
        'tosUrl': 'https://www.google.com',
        'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
            firebaseui.auth.CredentialHelper.GOOGLE_YOLO : firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
    };


}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Disable auto-sign in.
ui.disableAutoSignIn();


/**
 * @return {string} The URL of the FirebaseUI standalone widget.
 */
function getWidgetUrl() {
    return '/widget#recaptcha=' + getRecaptchaMode();
}


/**
 * Redirects to the FirebaseUI widget.
 */
var signInWithRedirect = function () {
    window.location.assign(getWidgetUrl());
};


/**
 * Open a popup with the FirebaseUI widget.
 */
var signInWithPopup = function () {
    window.open(getWidgetUrl(), 'Sign In', 'width=985,height=735');
};


/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var newUser = true;
var handleSignedInUser = function (user) {
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    document.getElementById('phone').textContent = user.phoneNumber;


    var ref = firebase.database().ref().child("Usuarios").child(user.uid);

    if (newUser) {
        ref.child("UID").set(user.uid);
        ref.child("Name").set(user.displayName);
        ref.child("Email").set(user.email);
        ref.child("Phone Number").set(user.phoneNumber);
        ref.child("Photo URL").set(user.photoURL);
        ref.child("mensajesPublicos").set(0);
        ref.child("mensajesPrivados").set(0);
    }

    if (user.photoURL) {
        var photoURL = user.photoURL;
        // Append size to the photo URL for Google hosted images to avoid requesting
        // the image with its original resolution (using more bandwidth than needed)
        // when it is going to be presented in smaller size.
        if ((photoURL.indexOf('googleusercontent.com') != -1) ||
            (photoURL.indexOf('ggpht.com') != -1)) {
            photoURL = photoURL + '?sz=' +
                document.getElementById('photo').clientHeight;
        }
        document.getElementById('photo').src = photoURL;
        document.getElementById('photo').style.display = 'block';
    } else {
        document.getElementById('photo').style.display = 'none';
    }
};



/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function () {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function (user) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Deletes the user's account.
 */
var deleteAccount = function () {
    firebase.auth().currentUser.delete().catch(function (error) {
        if (error.code == 'auth/requires-recent-login') {
            // The user's credential is too old. She needs to sign in again.
            firebase.auth().signOut().then(function () {
                // The timeout allows the message to be displayed after the UI has
                // changed to the signed out state.
                setTimeout(function () {
                    alert('Please sign in again to delete your account.');
                }, 1);
            });
        }
    });
};


/**
 * Handles when the user changes the reCAPTCHA config.
 */
function handleRecaptchaConfigChange() {
    var newRecaptchaValue = document.querySelector(
        'input[name="recaptcha"]:checked').value;
    location.replace(location.pathname + '#recaptcha=' + newRecaptchaValue);

    // Reset the inline widget so the config changes are reflected.
    ui.reset();
    ui.start('#firebaseui-container', getUiConfig());
}


/**
 * Initializes the app.
 */
var initApp = function () {
    /*document.getElementById('sign-in-with-redirect').addEventListener(
        'click', signInWithRedirect);
    document.getElementById('sign-in-with-popup').addEventListener(
        'click', signInWithPopup);*/
    document.getElementById('sign-out').addEventListener('click', function () {
        firebase.auth().signOut();
    });
    document.getElementById('delete-account').addEventListener(
        'click',
        function () {
            deleteAccount();
        });

    document.getElementById('signOutNav').addEventListener(
        'click', function () {
            firebase.auth().signOut();
        });
    /*document.getElementById('recaptcha-normal').addEventListener(
        'change', handleRecaptchaConfigChange);
    document.getElementById('recaptcha-invisible').addEventListener(
        'change', handleRecaptchaConfigChange);
    // Check the selected reCAPTCHA mode.
    document.querySelector(
        'input[name="recaptcha"][value="' + getRecaptchaMode() + '"]')
        .checked = true;*/

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('SW registered');

        } catch (error) {
            console.log('SW reg failed');

        }
    }
};

window.addEventListener('load', initApp);

//var ref = firebase.database.ref();

/*function submitClick() {
    //    var messageText = publicMessage.value;
    var firstName = fName.value;
    var lastName = lName.value;
    var passwordJS = password.value;
    //var firebaseRef = firebase.database().ref('/Users/ID/' + publicMessage).set(messageText);
    //ref.child("Usuarios").child(user.id).child("UID").set(user.id);
    ref.child("Users").child(user.uid).child("userName").set(user.displayName);


    //firebaseRef.child("publicMessage").set(messageText);
}*/