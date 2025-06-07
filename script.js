function simulate() {
  const arrivalTimes = [
    parseInt(document.getElementById('p0').value),
    parseInt(document.getElementById('p1').value),
    parseInt(document.getElementById('p2').value),
    parseInt(document.getElementById('p3').value),
    parseInt(document.getElementById('p4').value)
  ];

  const burstTimes = [6, 5, 3, 4, 2]; 
  const n = 5;
  const remaining = [...burstTimes];
  const completed = Array(n).fill(false);
  const completionTime = Array(n).fill(0);
  const timeline = [];
  let time = 0;
  let completedCount = 0;

  while (completedCount < n) {
    let idx = -1;
    let minRem = Infinity;

    for (let i = 0; i < n; i++) {
      if (!completed[i] && arrivalTimes[i] <= time && remaining[i] < minRem && remaining[i] > 0) {
        minRem = remaining[i];
        idx = i;
      }
    }

    if (idx === -1) {
      timeline.push("-");
      time++;
    } else {
      timeline.push("P" + idx);
      remaining[idx]--;
      time++;
      if (remaining[idx] === 0) {
        completed[idx] = true;
        completionTime[idx] = time;
        completedCount++;
      }
    }
  }

  // gantt chart
  const timelineDiv = document.getElementById("timeline");
  timelineDiv.innerHTML = "";
  timeline.forEach(t => {
    const box = document.createElement("div");
    box.className = "gantt-box";
    box.textContent = t;
    timelineDiv.appendChild(box);
  });

  // calculate metrics
  const turnaroundTime = [];
  const waitingTime = [];
  let totalTAT = 0, totalWT = 0;

  for (let i = 0; i < n; i++) {
    turnaroundTime[i] = completionTime[i] - arrivalTimes[i];
    waitingTime[i] = turnaroundTime[i] - burstTimes[i];
    totalTAT += turnaroundTime[i];
    totalWT += waitingTime[i];
  }

  // fill table
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>P${i}</td>
      <td>${arrivalTimes[i]}</td>
      <td>${burstTimes[i]}</td>
      <td>${completionTime[i]}</td>
      <td>${turnaroundTime[i]}</td>
      <td>${waitingTime[i]}</td>
    `;
    tbody.appendChild(row);
  }

  // show averages
  document.getElementById("averages").textContent = 
    `Average Turnaround Time: ${(totalTAT/n).toFixed(2)} | Average Waiting Time: ${(totalWT/n).toFixed(2)}`;
}
