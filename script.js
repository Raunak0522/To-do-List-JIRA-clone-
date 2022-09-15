let addbtn = document.querySelector(".add-btn");

let modalcont = document.querySelector(".modal-cont");

let maincont = document.querySelector(".main-cont");

let colors = ["lightgreen", "lightblue", "lightyellow", "black"];
let defaultcolor = colors[colors.length - 1]; //black
let allprioritycolor = document.querySelectorAll(".priority-cont");

let addFlag = false;

let ticketArr = [];

let taskAreaCont = document.querySelector(".textarea-cont");
let toolBoxColor = document.querySelectorAll(".color");

let removeBtn = document.querySelector(".close-btn");
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

//get all tickets from localstorage
if (localStorage.getItem("tickets")) {
  ticketArr = JSON.parse(localStorage.getItem("tickets"))
  ticketArr.forEach(function(ticket){
    createTicket(ticket.ticketcolor, ticket.id, ticket.tickettask)
  })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//filter tickets with respect to colors

for (let i = 0; i < toolBoxColor.length; i++) {
  toolBoxColor[i].addEventListener("click", function (e) {
    let currentToolboxColor = toolBoxColor[i].classList[0];

    let filteredTickets = ticketArr.filter(function (ticketObj) {
      return currentToolboxColor === ticketObj.ticketcolor;
    });

    //remove the tickets currently present on screen
    let allTickets = document.querySelectorAll(".ticketscont");
    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }
    //filtered tickets Display
    filteredTickets.forEach(function (filterObj) {
      createTicket(
        filterObj.ticketcolor,
        filterObj.tickettask,
        filterObj.ticketId
      );
    });
  });
  //on double click every tickets is shown
  toolBoxColor[i].addEventListener("dblclick", function (e) {
    let allTickets = document.querySelectorAll(".ticketscont");
    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }
    ticketArr.forEach(function (ticketobj) {
      createTicket(
        ticketobj.ticketcolor,
        ticketobj.tickettask,
        ticketobj.ticketId
      );
    });
  });
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

addbtn.addEventListener("click", function (e) {
  // display the modal-cont
  //addflag=true -Modal Display
  //addfalg=false-Modal hide
  addFlag = !addFlag;
  if (addFlag == true) {
    modalcont.style.display = "flex";
  } else {
    modalcont.style.display = "none";
  }
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//Changing default color
allprioritycolor.forEach(function (colorElem) {
  colorElem.addEventListener("click", function (e) {
    allprioritycolor.forEach(function (prioritycolorelem) {
      prioritycolorelem.classList.remove("active");
    });
    colorElem.classList.add("active");
    defaultcolor = colorElem.classList[0]; //yahan s active class wla classs link select ho jayega
  });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Generating a ticket
modalcont.addEventListener("keydown", function (e) {
  let key = e.key;

  if (key == "Enter") {
    createTicket(defaultcolor, taskAreaCont.value); //this function will generate ticket
    modalcont.style.display = "none"; //flex close ho jaya ticket generate hona p
    addFlag = false; //taki do baar click n krna pada
    taskAreaCont.value = " ";
  }
});

function createTicket(ticketcolor, ticketId, tickettask) {
  let id = ticketId || shortid();
  let ticketscont = document.createElement("div");
  ticketscont.setAttribute("class", "ticketscont");

  //   ticketscont.innerHTML = `<div class="tickets-color ${ticketcolor}"></div>
  //     <div class="tickets-id">${"SampleId"}</div>
  //     <div class="tickets-textarea">${task}</div>`;
  ticketscont.innerHTML = `<div class="tickets-color ${ticketcolor}"></div>
  <div class="tickets-id">#${id}</div>
  <div class="tickets-textarea">${tickettask}</div>
  <div class="ticket-lock">
      <i class="fa-solid fa-lock"></i>
  </div>`;

  maincont.append(ticketscont);

  handleRemove(ticketscont , id);

  handlelock(ticketscont , id);

  handlecolor(ticketscont , id);

  if (!ticketId) {
    ticketArr.push({ ticketcolor,ticketId: id ,tickettask });
    localStorage.setItem("tickets", JSON.stringify(ticketArr))
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// remove button working

removeBtn.addEventListener("click", function () {
  removeFlag = !removeFlag;
  if (removeFlag == true) {
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "grey";
  }
});



function handleRemove(ticket, id) {
  ticket.addEventListener("click", function () {
    if (!removeFlag) return
    let idx = getTicketIdx(id) //index a jayega jispe click hoga
    //removal of ticket in  localstorage
    ticketArr.splice(idx , 1)
    let strTicketArray = JSON.stringify(ticketArr)
    localStorage.setItem("tickets", strTicketArray)

    ticket.remove();
  });
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// lock & unlock tickets

function handlelock(ticket ,id) {
  let ticketlockElem = ticket.querySelector(".ticket-lock");

  let ticketLock = ticketlockElem.children[0];

  let tickettaskarea = ticket.querySelector(".tickets-textarea");

  ticketLock.addEventListener("click", function (e) {
    let ticketIdx=getTicketIdx(id)
    if (ticketLock.classList.contains(lockClass)) {
      ticketLock.classList.remove(lockClass);
      ticketLock.classList.add(unlockClass);
      tickettaskarea.setAttribute("contenteditable", true);
    } else {
      ticketLock.classList.remove(unlockClass);
      ticketLock.classList.add(lockClass);
      tickettaskarea.setAttribute("contenteditable", false);
    }

    ticketArr[ticketIdx].tickettask=tickettaskarea.innerText
    localStorage.setItem("tickets", JSON.stringify(ticketArr))
  });
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// colorhandling
function handlecolor(ticket , id ) {
  let ticketColorband = ticket.querySelector(".tickets-color");
  
  ticketColorband.addEventListener("click", function (e) {
    let currentTicketcolor = ticketColorband.classList[1];

    let ticketIdx = getTicketIdx(id);

    let currentTicketcolorindx = colors.findIndex(function (color) {
      return currentTicketcolor === color;
    });
    currentTicketcolorindx++;

    let newTicketcolorIndex = currentTicketcolorindx % colors.length;
    let newTicketcolor = colors[newTicketcolorIndex];

    ticketColorband.classList.remove(currentTicketcolor);
    ticketColorband.classList.add(newTicketcolor);

    //modify new color
    ticketArr[ticketIdx].ticketcolor = newTicketcolor
    localStorage.setItem("tickets", JSON.stringify(ticketArr))
  });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// get ticket id to remove all the tickets after refresh the page

function getTicketIdx(id) {
  let ticketidx = ticketArr.findIndex(function (ticktobj) {
    return ticktobj.ticketId === id;
  })
  return ticketidx;
}
