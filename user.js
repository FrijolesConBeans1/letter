// user.js

import {
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const menu          = document.getElementById("menu");
const letterPage    = document.getElementById("letterPage");
const letterSection = document.getElementById("letterSection");

// 🔐 protect + load on auth ready
onAuthStateChanged(window.auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // ✅ auth is confirmed, safe to use user.email now
    setupButtons(user.email);
  }
});

function setupButtons(email) {
  document.getElementById("library").addEventListener("click", () => loadLetters(email, false));
  document.getElementById("newLetter").addEventListener("click", () => loadLetters(email, true));
}

async function loadLetters(email, newestOnly) {
  menu.style.display = "none";        // ✅ add this
  letterPage.style.display = "block"; // ✅ add this

  try {
    const q = query(
      collection(window.db, "letters"),
      where("to", "==", email)
    );

    const snapshot = await getDocs(q);

    let letters = [];
    snapshot.forEach(doc => letters.push(doc.data()));
    letters.sort((a, b) => b.createdAt - a.createdAt);

    // newestOnly = true means only show the first one
    if (newestOnly) letters = letters.slice(0, 1);

    showEnvelopes(letters);

  } catch (err) {
    console.error(err);
    alert("Failed to load letters: " + err.message);
  }
}

function showEnvelopes(letters) {
  const container = document.getElementById("envelopeContainer");

  container.innerHTML = "";
  container.style.display = "flex";

  letters.forEach((letter) => {
    const toLetter = letter.to.replace("@letters.app", "");

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const isOpened = letter.opened === false;

    wrapper.innerHTML = `
      <div class="${isOpened ? "lidO" : "lid"} one"></div>
      <div class="${isOpened ? "lidO" : "lid"} two"></div>
      <div class="${isOpened ? "envelopeO" : "envelope"}"></div>
      <div class="letter">
        <button class="openBtn">Open</button>
        <p class="sendFrom">From: ${letter.from}</p>
        <p class="sendFrom">To: ${toLetter}</p>
        <p>${letter.subject}</p>
      </div>
    `;

    wrapper.querySelector(".openBtn").addEventListener("click", () => {
      openLetter(letter);
    });

    container.appendChild(wrapper);
  });
}

function openLetter(letter) {
  letterPage.style.display = "none";
  letterSection.style.display = "flex";

  document.getElementById("letterTitle").innerText = letter.subject;
  document.getElementById("lether").innerText = letter.message;
}

// back from letter view → envelope grid
document.getElementById("backBtn").addEventListener("click", () => {
  letterSection.style.display = "none";
  letterPage.style.display = "block";
});

// back from envelope grid → main menu
document.getElementById("backToM").addEventListener("click", () => {
  letterPage.style.display = "none";
  menu.style.display = "block";
});

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(window.auth);
  window.location.href = "index.html";
});