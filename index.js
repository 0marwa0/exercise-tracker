function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  synth.speak(utterance);
}
function playTickSound() {
  const audio = new Audio("clock.mp3");
  audio.play();
}
function getExercises() {
  let exercises = localStorage.getItem("exercises");
  if (exercises) {
    return JSON.parse(exercises);
  } else {
    return [];
  }
}

function displayExercises() {
  let exercises_list = document.getElementById("exercises-list");
  exercises_list.innerHTML = "";
  let exercises = getExercises();
  const run_btn = document.getElementById("run");
  exercises.forEach((element, index) => {
    const exercises_element = document.createElement("a");
    exercises_element.classList.add(
      "is-flex-direction-row",
      "is-justify-content-space-between"
    );
    const delete_btn = document.createElement("button");
    delete_btn.textContent = "Delete";
    delete_btn.classList.add("button", "is-danger");
    exercises_element.classList.add("panel-block");
    exercises_element.textContent = element.name + element.time;
    exercises_element.appendChild(delete_btn);
    exercises_list.appendChild(exercises_element);

    delete_btn.addEventListener("click", () => {
      exercises.splice(index, 1);
      localStorage.setItem("exercises", JSON.stringify(exercises));
      displayExercises();
    });
  });
  if (exercises.length != 0) {
    run_btn.disalbed = true;
  } else {
    run_btn.disalbed = false;
  }
}
let countdownInterval;

async function countDown(timeInput, name) {
  return new Promise(async (resolve) => {
    const countdownElement = document.getElementById("countdown");
    const totalTimeInSeconds = Number(timeInput);

    speak(name); // Start speaking the name

    let remainingTime = totalTimeInSeconds;
    let secondsLeft = 60;

    while (remainingTime > 0) {
      countdownElement.textContent = `Time remaining: ${Math.floor(
        remainingTime
      )}m : ${secondsLeft}s`;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      secondsLeft--;
      playTickSound();
      if (secondsLeft <= 0) {
        secondsLeft = 60;
        remainingTime--;
      }
    }

    countdownElement.textContent = "Done!";
    resolve();
  });
}

document.getElementById("run").addEventListener("click", async () => {
  let exercises = getExercises();
  for (const element of exercises) {
    await countDown(element.time, element.name);
  }
});

document.getElementById("add").addEventListener("click", () => {
  let exercise_name = document.getElementById("name");
  let exercise_time = document.getElementById("time");
  if (exercise_name.value.trim() != "" && exercise_time.value.trim() != "") {
    let exercises = getExercises();
    exercises.push({ name: exercise_name.value, time: exercise_time.value });
    localStorage.setItem("exercises", JSON.stringify(exercises));

    displayExercises();
    exercise_name.value = "";
    console.log("adding", exercises);
  } else {
    alert("exercis name and time are must!");
  }
});
window.addEventListener("load", () => {
  const run_btn = document.getElementById("run");
  let exercises = getExercises();
  if (exercises.length != 0) {
    run_btn.disalbed = true;
  }
  displayExercises();
});
