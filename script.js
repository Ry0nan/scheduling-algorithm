document.getElementById("arrivalForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const burstTimes = { P1: 6, P2: 8, P3: 7, P4: 3 };
  const arrivalTimes = {
    P1: parseInt(this.P1.value),
    P2: parseInt(this.P2.value),
    P3: parseInt(this.P3.value),
    P4: parseInt(this.P4.value),
  };

  const processes = Object.keys(burstTimes).map(name => ({
    name,
    arrival: arrivalTimes[name],
    burst: burstTimes[name],
    remaining: burstTimes[name],
    completed: false
  }));

  let time = 0;
  const executionOrder = [];

  while (processes.some(p => !p.completed)) {
    const ready = processes.filter(p => p.arrival <= time && !p.completed);
    if (ready.length > 0) {
      const shortest = ready.reduce((a, b) => a.remaining < b.remaining ? a : b);
      shortest.remaining--;
      executionOrder.push(shortest.name);
      if (shortest.remaining === 0) {
        shortest.completed = true;
      }
    } else {
      executionOrder.push("-");
    }
    time++;
  }

  const output = document.getElementById("output");
  output.innerHTML = `<h2>Execution Timeline:</h2><div class="gantt">` +
    executionOrder.map(p => `<div class="gantt-box">${p}</div>`).join("") +
    `</div>`;
});
