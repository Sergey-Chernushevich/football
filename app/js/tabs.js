const tabsBtnList = document.querySelectorAll(".tabs__tab");
const tabs = document.querySelectorAll(".tabsContent__item");

for (let i = 0; i < tabsBtnList.length; i++) {
  tabsBtnList[i].addEventListener("click", (event) => {
    for (let i = 0; i < tabsBtnList.length; i++) {
      tabsBtnList[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }
    document.getElementById(`tab${i + 1}`).classList.add("active");
  });
}
