let filters = [...document.getElementsByClassName("filter")];
let items = [...document.querySelectorAll(".list > .item")];

function changeDisp() {
  if (window.innerWidth > 480 && !filters[0].classList.contains("show")) {
    filters[0].classList.add("show");
    filters[1].classList.remove("show");
  } else if (window.innerWidth < 480 && filters[0].classList.contains("show")) {
    filters[0].classList.remove("show");
    filters[1].classList.add("show");
  }
  return this;
}

function clearCompleted() {
  const ticked = document.getElementsByClassName("ticked");
  for (let item of ticked) {
    item.remove();
  }
  return this;
}

function toggleActive(event) {
  [...document.querySelectorAll(".show > button")].forEach((element) => {
    element.classList.remove("active");
  });
  event.target.classList.add("active");
  toggleHide(event.target.classList.value.match(/(all|active|complete)+?/)[0]);
  return this;
}

function toggleHide(param) {
  let items = [...document.querySelectorAll(".item")];
  items.forEach((val) => val.classList.remove("hide"));
  switch (param) {
    case "active":
      items
        .filter((val) => val.classList.contains("ticked"))
        .forEach((val) => val.classList.add("hide"));
      break;
    case "complete":
      items
        .filter((val) => !val.classList.contains("ticked"))
        .forEach((val) => val.classList.add("hide"));
      break;
    default:
      break;
  }
  return this;
}
function refreshCount() {
  const count = document.querySelectorAll(".item:not(.ticked)").length;
  itemsCount.innerText = count;
  return this;
}

function toggleItem(event){
  event.target.parentNode.classList.toggle("ticked");
  console.log(this);
  toggleHide(
    document
      .querySelector(".show >.active")
      .classList.value.match(/(all|active|complete)+?/)[0]
  );
  refreshCount();
};

for (let item of items) {
  item.querySelector('.tick').addEventListener("click", toggleItem);
}

let crosses = document.getElementsByClassName("cross");
const removeItem = (event) => {
  event.target.parentNode.parentNode.remove();
};

for (let cross of crosses) {
  cross.addEventListener("click", removeItem);
}

document.querySelector(".clear").addEventListener("click", clearCompleted);

const darkMode = (event) => {
  event.target.src =
    event.target.src.search("moon") != -1
      ? "images/icon-sun.svg"
      : "images/icon-moon.svg";
  document.body.classList.toggle("dark");
};

document.querySelector(".dark-mode").addEventListener("click", darkMode);

[...document.querySelectorAll(".filter > button")].forEach((btn) => {
  btn.addEventListener("click", toggleActive);
});

let itemsCount = document.querySelector(".items-count");

const createNewTask = (task) => {
  //create list of new elements
  const tags = ["li", "div", "span", "div", "img", "div", "img"];
  const keys = ["li", "tick", "task", "cross", "check", "filler", "x"];
  let elems = {};
  keys.forEach((key, tag) => (elems[key] = document.createElement(tags[tag])));

  //assing attr for elems
  elems.li.setAttribute("tabindex", "0");
  elems.li.setAttribute("draggable", "true");
  elems.li.classList.add("item", "row");
  elems.tick.classList.add("tick");
  elems.task.innerText = task;
  elems.cross.classList.add("cross");
  elems.check.src = "images/icon-check.svg";
  elems.filler.classList.add("filler");
  elems.x.src = "images/icon-cross.svg";
  elems.x.addEventListener("click", removeItem);

  //glueing elems onto li elem
  elems.li.appendChild(elems.tick);
  elems.li.appendChild(elems.task);
  elems.li.appendChild(elems.cross);
  elems.tick.appendChild(elems.check);
  elems.tick.appendChild(elems.filler);
  elems.cross.appendChild(elems.x);

  //appending new li to list
  const list = document.getElementsByTagName("ul")[0];
  list.appendChild(elems.li);
  list.appendChild(list.querySelector(".status"));

  //add eventListener to tick
  elems.tick.addEventListener("click", toggleItem);


  items.push(elems.li);
  refreshCount();
};

const input = document.querySelector("input");

input.addEventListener("keyup", ({ target, key }) => {
  if (key === "Enter") {
    createNewTask(input.value);
    target.value = "";
  }
});

//drag and drop

let dragSrcEl;

function handleDragStart(e) {
  this.style.opacity = "0.4";

  dragSrcEl = this;
  console.log(this.querySelector("span").innerText);

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.querySelector("span").innerText);
}

function handleDragEnd(e) {
  this.style.opacity = "1";

  items.forEach(function (item) {
    item.classList.remove("over");
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  return false;
}

function handleDragEnter(e) {
  this.classList.add("over");
}

function handleDragLeave(e) {
  this.classList.remove("over");
}

function handleDrop(e) {
  e.stopPropagation();
  if (dragSrcEl !== this) {
    dragSrcEl.querySelector("span").innerText = this.querySelector(
      "span"
    ).innerText;
    this.querySelector("span").innerText = e.dataTransfer.getData("text/html");

    let tmp = this.className;
    this.className = dragSrcEl.className;
    dragSrcEl.className = tmp;
  }

  return false;
}

items.forEach(function (item) {
  item.addEventListener("dragstart", handleDragStart, false);
  item.addEventListener("dragover", handleDragOver, false);
  item.addEventListener("dragenter", handleDragEnter, false);
  item.addEventListener("dragleave", handleDragLeave, false);
  item.addEventListener("dragend", handleDragEnd, false);
  item.addEventListener("drop", handleDrop, false);
});

changeDisp().refreshCount();
window.onresize = changeDisp;
