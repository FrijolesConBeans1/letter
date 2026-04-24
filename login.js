// login.js

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", login);

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    return alert("Enter username and password");
  }

  //  convert username → fake email
  const email = username + "@letters.app";

  try {
    const userCredential = await signInWithEmailAndPassword(window.auth, email, password);
    const user = userCredential.user;

    // optional (not required anymore but okay to keep)
    localStorage.setItem("currentUser", user.email);

    //  route user
    
    if (user.email === "admin@letters.app" || user.email === "gustavo@letters.app") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "user.html";
    }

  } catch (err) {
    console.error(err);
    alert("Wrong username or password");
  }
}
