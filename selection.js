export default class Canvas {
  // draw selection box
  // to start click and move mouse around and click to finish
  Draw(canvas) {
    // get all notes from the selected piano roll
    let notes = canvas.querySelector("svg").querySelectorAll("rect");
    // get mouse position
    function setMousePosition(e) {
      var ev = e || window.event; //Moz || IE
      if (ev.pageX) {
        //Moz
        mouse.x = ev.pageX + window.pageXOffset;
        mouse.y = ev.pageY + window.pageYOffset;
      } else if (ev.clientX) {
        //IE
        mouse.x = ev.clientX + document.body.scrollLeft;
        mouse.y = ev.clientY + document.body.scrollTop;
      }
    }
    // variable for mouse movement information
    var mouse = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
    };
    var element = null;
    // get mouse movement to set width and height
    canvas.onmousemove = function (e) {
      setMousePosition(e);
      if (element !== null) {
        element.style.width = Math.abs(mouse.x - mouse.startX) + "px";
        element.style.height = Math.abs(mouse.y - mouse.startY) + "px";
        element.style.left =
          mouse.x - mouse.startX < 0 ? mouse.x + "px" : mouse.startX + "px";
        element.style.top =
          mouse.y - mouse.startY < 0 ? mouse.y + "px" : mouse.startY + "px";
      }
    };

    canvas.onclick = function (e) {
      if (element !== null) {
        canvas.style.cursor = "default";
        console.log("finsihed.", mouse);
        // add close icon
        let icon = document.createElement("div");
        icon.innerHTML = "X";
        icon.classList.add("close");
        icon.id = "close";
        icon.addEventListener("click", function handleClick(event) {
          event.stopPropagation();
          // remove selection and selection info
          document.getElementById("selectionBox").remove();
          document.getElementById("info").remove();
        });
        document.getElementById("selectionBox").append(icon);
        element = null;

        // count notes inside selection
        countNotes();
      } else {
        mouse.startX = mouse.x;
        mouse.startY = mouse.y;
        mouse.startX = mouse.x;
        mouse.startY = mouse.y;
        element = document.createElement("div");
        element.className = "rectangle";
        element.id = "selectionBox";
        element.style.left = mouse.x + "px";
        element.style.top = mouse.y + "px";

        canvas.appendChild(element);
        canvas.style.cursor = "crosshair";
      }
    };
    // count number of notes selected
    function countNotes() {
      let count = 0;
      notes.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          mouse.startX <= rect.x &&
          rect.x <= mouse.x &&
          mouse.startY <= rect.y &&
          rect.y <= mouse.y
        )
          count++;
      });
      console.log(count);
      const selectedItem = document.getElementById("selectedItem");
      let info = document.createElement("div");
      info.id = "info";
      info.innerHTML = `Start X: ${mouse.startX}</br> End X: ${mouse.x}</br></br> 
      Start Y: ${mouse.startY} </br> End Y: ${mouse.y}</br> </br>Selected notes: ${count} `;
      selectedItem.append(info);
    }
  }
}
