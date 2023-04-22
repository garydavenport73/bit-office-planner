let nestedMenues = document.getElementsByClassName("nested-menu");
for (let nestedmenu of nestedMenues) {
    nestedmenu.addEventListener("click", (evt) => { toggleNest(evt.target) });
}

function toggleNest(menu) {
    let siblings = menu.parentElement.children;
    for (let sibling of siblings) {
        if (sibling === menu) {
            //alert("found self!");
        } else {
            if (sibling.style.display === "none") {
                sibling.style.display = "inherit";
            } else {
                sibling.style.display = "none";
            }
        }
    }
}

function toggleAll() {
    for (let nestedmenu of nestedMenues) {
        toggleNest(nestedmenu)
    }
}

function openSelectedInitialNests() {
    for (let nestedmenu of nestedMenues) {
        if (nestedmenu.classList.contains("initial-open")) {
            toggleNest(nestedmenu);
        }
    }
}

toggleAll()
openSelectedInitialNests()