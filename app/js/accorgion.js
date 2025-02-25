const accordionHeaders = document.getElementsByClassName("league__header");
for (let e = 0; e < accordionHeaders.length; e++)
  accordionHeaders[e].addEventListener("click", function () {
    this.classList.toggle("active");
  });
