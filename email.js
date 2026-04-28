function sendMail() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;

    if (!name || !email || !subject) {
        alert("Fill everything!");
        return;
    }

    let parms = {
        name: name,
        email: email,
        subject: subject,
    };

    emailjs.send("service_g2u2atq", "template_0h9i08w", parms)
    .then(function(response) {
        alert("Email Sent!");
    })
    .catch(function(error) {
    alert("Error: " + error.text);
});
}