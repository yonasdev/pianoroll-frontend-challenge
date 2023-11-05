import PianoRoll from "./pianoroll.js";
import Canvas from "./selection.js";

class PianoRollDisplay {
  constructor(csvURL) {
    this.csvURL = csvURL;
    this.data = null;
  }

  async loadPianoRollData() {
    try {
      const response = await fetch("https://pianoroll.ai/random_notes");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("piano-roll-card");
    cardDiv.id = rollId;

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("piano-roll-svg");
    svg.setAttribute("width", "80%");
    svg.setAttribute("height", "150");

    // click event listner for pianoroll list
    svg.addEventListener("click", function handleClick(event) {
      console.log(svg.parentElement.id);
      const selectedItem = document.getElementById("selectedItem");
      selectedItem.classList.remove("hide-item");
      let temp = document.createElement("div");
      temp.innerHTML = document.getElementById(rollId).innerHTML;
      temp
        .querySelector("#svgContainer")
        .querySelector("svg")
        .setAttribute("height", "250");
      selectedItem.innerHTML = "";
      selectedItem.append(temp);
      const canvas = new Canvas();
      document.getElementById("pianoRollContainer").style.gridTemplateColumns =
        "repeat(2, 1fr)";
      // const parent = document.getElementById("selectedItem");
      canvas.Draw(temp.querySelector("#svgContainer"));
    });

    // Append the SVG to the card container
    const svgContainer = document.createElement("div");
    svgContainer.append(svg);
    svgContainer.id = "svgContainer";
    svgContainer.style.display = "inline";
    cardDiv.appendChild(svgContainer);
    document.getElementById("pianoRollContainer").classList.add("single-row");
    return { cardDiv, svg };
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData();
    if (!this.data) return;

    const pianoRollContainer = document.getElementById("pianoRollContainer");
    pianoRollContainer.innerHTML = "";
    for (let it = 0; it < 20; it++) {
      const start = it * 60;
      const end = start + 60;
      const partData = this.data.slice(start, end);

      const { cardDiv, svg } = this.preparePianoRollCard(it);

      pianoRollContainer.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }
}

document.getElementById("loadCSV").addEventListener("click", async () => {
  const csvToSVG = new PianoRollDisplay();
  await csvToSVG.generateSVGs();
});
