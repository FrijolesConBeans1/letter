// admin.js

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

//  Protect admin page
onAuthStateChanged(window.auth, (user) => {
  if (!user || user.email !== "admin@letters.app") {
    window.location.href = "index.html";
  }
});

document.getElementById("sendBtn").addEventListener("click", sendLetter);

async function sendLetter() {
  const toUsername = document.getElementById("sendTo").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (!toUsername || !subject || !message) {
    return alert("Fill everything");
  }

  const letter = {
    to: toUsername + "@letters.app", //  username
    from: document.getElementById('sendFrom').value,
    subject,
    message,
    createdAt: Date.now(),
    opened: null
  };

  try {
    await addDoc(collection(window.db, "letters"), letter);

    alert("Letter sent 💌");

    // clear inputs
    document.getElementById("sendTo").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";

  } catch (err) {
    console.error(err);
    alert("Failed to send");
  }
}

// Logout
document.getElementById("adLogout").addEventListener("click", () => {
  signOut(window.auth);
  window.location.href = "index.html";
});