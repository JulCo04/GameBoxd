import React, { useState } from "react";
import { redirect } from "react-router-dom";

function Settings({ onExitClick, currentDisplayName, currentEmail }) {
  let newUserPassword = '';
  let formErrors = {};

  let userDisplayNameInputRef;
  let userEmailInputRef;
  let userNewPasswordRef;
  let userNewPasswordRetypeRef;

  const [showOverlay, setShowOverlay] = useState(true); // State to track overlay visibility
  const [nameText, setNameText] = useState(currentDisplayName);
  const [emailText, setEmailText] = useState(currentEmail);
  const [newPasswordText, setNewPasswordText] = useState('');
  const [newPasswordRetypeText, setNewPasswordRetypeText] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
      return 'http://localhost:5000/' + route;
    }
  }

  const handleExitButtonClick = () => {
    onExitClick();
    // Toggle the state to hide the overlay
    setShowOverlay(false);
  };

  const userInputValidation = (email, newPassword, newPasswordRetype) => {
    let formIsValid = true;
    formErrors["passwords"] = "";
    formErrors["email"] = "";

    if (newPassword !== newPasswordRetype) {
      formErrors["passwords"] = " - Passwords must match";
      formIsValid = false;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      formErrors["email"] = " - Invalid email";
      formIsValid = false;
    }

    setErrors(formErrors);
    return formIsValid;

  };

  const doUpdateUser = async event => {
    event.preventDefault();
    newUserPassword = userNewPasswordRef.value;

    let obj = { email: currentEmail, newEmail: userEmailInputRef.value, newPassword: newUserPassword, newDisplayName: userDisplayNameInputRef.value };
    let js = JSON.stringify(obj);
    console.log("Printing JS: " + js);
    setSuccessMessage('');

    if (userInputValidation(userEmailInputRef.value, userNewPasswordRef.value, userNewPasswordRetypeRef.value)) {

      try {
        const response = await fetch(buildPath("api/updateuser"),
          { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
        console.log("Response: " + response.ok);

        let oldUserData = JSON.parse(localStorage.getItem('user_data'));
        // console.log(oldUserData);
        // console.log("OLD USERDATA: " + JSON.stringify(oldUserData));
        let newUserData = { id: oldUserData.id, displayName: obj.newDisplayName, email: obj.newEmail, dateCreated: oldUserData.dateCreated };
        // console.log("NEW USERDATA: " + JSON.stringify(newUserData));

        let res = JSON.parse(await response.text());
        console.log("Update User Result: " + res.error);

        localStorage.removeItem('user_data');
        localStorage.setItem('user_data', JSON.stringify(newUserData));
        console.log("UPDATED");

        setSuccessMessage("Successfully Updated");

      }
      catch (e) {
        alert(e.toString());
        return;
      }
    }
    else {

    }
  }

  const doDeleteAccount = async () => {
    let userData = JSON.parse(localStorage.getItem('user_data'));
    let userId = userData.id;
    let testId = 0;

    let obj = {id: userId};
    let js = JSON.stringify(obj);


    try {
      const response = await fetch(buildPath("api/deleteuser"),
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json'} });
      console.log("Response: " + response.ok);


      let res = JSON.parse(await response.text())
      // console.log("Delete User Result: " + JSON.stringify(res));

      if(res.successMessage) {
        window.alert("Account Deleted");
        window.location.href = '/';
        return;
      }
      else if(res.error) {
        window.alert("There was an error: " + res.error);
        return;
      }
    }
    catch(e) {
      alert(e.toString());
      return;
    }

  }

  const deleteAccountPrompt = () => {
    let text = "Are you sure you want to delete your account? This action cannot be undone.";
    
    if (window.confirm(text) == true) {
      doDeleteAccount();
    } else {
    }

  }


  return (
    showOverlay && (
      <div className="overlay">
        <div className="form-container">
          <h1 className="text-white mb-4 fw-bold">Account Settings</h1>
          <button className="exit-button" onClick={handleExitButtonClick}>
            <img src="/x-button.png" alt="EXIT"></img>
          </button>

          <div className="form-group">

            <label className="fw-semibold fs-4">Display Name</label><br />
            <input className="fs-5" type="text" id="displayName" value={nameText} placeholder="Enter your display name"
              onChange={(e) => setNameText(e.target.value)} ref={(c) => userDisplayNameInputRef = c} /><br />

            <label className="fw-semibold fs-4">Email</label><br />
            <input className="fs-5" type="text" id="email" value={emailText} placeholder="Enter your email"
              onChange={(e) => setEmailText(e.target.value)} ref={(c) => userEmailInputRef = c} /><br />

            <label className="fw-semibold fs-2">Change Password</label><br />

            <label className="fw-semibold fs-4">New Password</label><br />
            <input className="fs-5" type="password" autoComplete="new-password" id="password" value={newPasswordText} placeholder="Enter your new password"
              onChange={(e) => setNewPasswordText(e.target.value)} ref={(c) => userNewPasswordRef = c} /><br />

            <label className="fw-semibold fs-4">Retype New Password</label><br />
            <input className="fs-5" type="password" autoComplete="new-password" id="password" value={newPasswordRetypeText} placeholder="Retype your new password"
              onChange={(e) => setNewPasswordRetypeText(e.target.value)} ref={(c) => userNewPasswordRetypeRef = c} /><br />
          </div>


          <div className="row justify-content-between mx-0">
            <button className="col-auto fw-semibold btn btn-primary text-white mx-0 " onClick={doUpdateUser}>Apply</button><br />
            <button className="col-auto fw-semibold btn btn-danger text-white ms-8 " onClick={deleteAccountPrompt}>Delete Account</button><br />
          </div>
          <div className="text-danger fw-semibold fs-5">{errors["passwords"]}</div>
          <div className="text-danger fw-semibold fs-5">{errors["email"]}</div>
          <div className="text-success fw-semibold fs-5">{successMessage}</div>
        </div>
      </div>
    )
  );
}

export default Settings;