const datesItemList = document.querySelectorAll(".datesList__item");

for (let i = 0; i < datesItemList.length; i++) {
  datesItemList[i].addEventListener("click", (event) => {
    for (let i = 0; i < datesItemList.length; i++) {
      datesItemList[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");
  });
}
