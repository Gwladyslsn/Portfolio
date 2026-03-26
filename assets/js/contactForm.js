const form = document.getElementById("contactForm");
const successMessage = document.getElementById("formSuccess");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const data = new FormData(form);

    const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    });

    if (response.ok) {
        form.reset();
        successMessage.classList.remove("d-none");
    } else {
        alert("Une erreur est survenue. Merci de réessayer.");
    }

});