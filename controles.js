function generateSubjects() {
  let yn = document.getElementById("yn").value.trim();
  let lev = document.getElementsByName("lev");
  let nb = document.getElementById("nb").value.trim();
  let subg = document.getElementById("subg");
  let cont = document.getElementById("subjectsContainer");

  if (yn.length == 0) {
    alert("You didn't Enter Your Name ! ");
    return false;
  }
  let coch = false;
  for (let i = 0; i < lev.length; i++) {
    if (lev[i].checked) {
      coch = true;
    }
  }
  if (coch == false) {
    alert("You didn't Enter Your Level ! ");
    return false;
  }
  if (nb.length == 0 || nb <= 0) {
    alert("You didn't Enter the Number of Subjects ! ");
    return false;
  }

  let codehtml = "";
  for (let i = 1; i <= nb; i++) {
    codehtml += `<div><h5>Subject${i}</h5><label>Subject Name : </label><input type="text" id="s${i}" name="s${i}" required></input><label>Difficulty</label><select id="d${i}" name="d${i}"><option>Easy</option><option>Medium</option><option>Hard</option></select></div>`;
  }
  cont.innerHTML = "<h6>Subjects</h6>" + codehtml;
}

function verif() {
  let mon = document.getElementById("mon");
  let tue = document.getElementById("tue");
  let wed = document.getElementById("wed");
  let thu = document.getElementById("thu");
  let fri = document.getElementById("fri");
  let sat = document.getElementById("sat");
  let sun = document.getElementById("sun");
  let time = document.getElementsByName("time");
  let hours = document.getElementById("hours").value.trim();

  let coch = false;
  if (
    mon.checked ||
    tue.checked ||
    wed.checked ||
    thu.checked ||
    fri.checked ||
    sat.checked ||
    sun.checked
  ) {
    coch = true;
  }
  if (!coch) {
    alert("Choose available days ! ");
    return false;
  }

  coch = false;
  for (let i = 0; i < time.length; i++) {
    if (time[i].checked) {
      coch = true;
    }
  }
  if (!coch) {
    alert("Choose preferred study time ! ");
    return false;
  }
  if (hours.length <= 0 || hours <= 0) {
    alert("Choose available study hours ! ");
    return false;
  }

  return true;
}

function generatePlan() {
  let params = new URLSearchParams(window.location.search);

  let name = params.get("yn");
  let nb = Number(params.get("nb"));
  let time = params.get("time");
  let hours = Number(params.get("hours"));

  let hard = [];
  let medium = [];
  let easy = [];

  for (let i = 1; i <= nb; i++) {
    let subject = params.get("s" + i);
    let difficulty = params.get("d" + i);

    if (difficulty == "Hard") {
      hard.push({ name: subject, hours: 2 });
    } else if (difficulty == "Medium") {
      medium.push({ name: subject, hours: 1.5 });
    } else {
      easy.push({ name: subject, hours: 1 });
    }
  }

  let subjects = hard.concat(medium, easy);

  let days = [];
  let dayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  for (let i = 0; i < dayNames.length; i++) {
    if (params.get(dayNames[i]) != null) {
      days.push(params.get(dayNames[i]));
    }
  }

  if (days.length == 0) {
    alert("Please choose at least one study day!");
    return;
  }

  let schedule = [];

  for (let i = 0; i < days.length; i++) {
    schedule[i] = [];
  }

  let day = 0;
  let totalHours = 0;

  for (let i = 0; i < subjects.length; i++) {
    if (totalHours + subjects[i].hours <= hours) {
      schedule[day].push(subjects[i]);
      totalHours += subjects[i].hours;
    } else {
      day++;
      totalHours = subjects[i].hours;

      if (day < days.length) {
        schedule[day].push(subjects[i]);
      }
    }

    if (day >= days.length) {
      day = days.length - 1;
    }
  }

  let result = `
  <h4>🎉 Your Personalized Study Plan is Ready!</h4>
  <h4>Hello ${name}, Aspire created a plan based on your difficulty, availability and time.</h4>
  <p>⏰ Preferred Study Time: ${time}</p>
  <p>⌛ Available Hours Per Day: ${hours} hours</p>
  `;

  for (let i = 0; i < days.length; i++) {
    if (schedule[i].length > 0) {
      result += `<h3>📅 ${days[i]}</h3>`;

      for (let j = 0; j < schedule[i].length; j++) {
        result += `
        <p>
        📚 ${schedule[i][j].name} - ${schedule[i][j].hours} hours
        </p>
        `;
      }
    }
  }

  document.getElementById("result").innerHTML = result;
}
