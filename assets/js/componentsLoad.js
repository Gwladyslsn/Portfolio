async function loadHTML(id, file) {
    const response = await fetch(file);
    const data = await response.text();
    document.getElementById(id).innerHTML = data;
}




loadHTML("header", "./html/components/header.html");
loadHTML("footer", "./html/components/footer.html");