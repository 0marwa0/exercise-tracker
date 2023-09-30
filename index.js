let isCountdownRunning = false;
let resumeExercise = false;
let currentExercise = 0;
let currentMinuts = 0;
let currentSeconds = 0;
const circularBar = document.querySelector(".circular-bar");
const percent = document.querySelector(".percent");
let initialValue = 0;
let finalValue = 100;

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

async function countDown(timeInput, name, i) {
  return new Promise(async (resolve) => {
    const exercises = getExercises();
    const countdownElement = document.getElementById("countdown");
    const totalTimeInSeconds = Number(timeInput);
    currentExercise = i;
    speak(name); // Start speaking the name

    let remainingTime = resumeExercise ? currentMinuts : totalTimeInSeconds - 1;
    let secondsLeft = resumeExercise ? currentSeconds : 60;

    while (remainingTime >= 0 && isCountdownRunning) {
      countdownElement.textContent = `Time remaining: ${Math.floor(
        remainingTime
      )}m : ${secondsLeft}s`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      secondsLeft--;
      currentSeconds = secondsLeft;
      currentMinuts = remainingTime;
      let iteration = remainingTime * 60 + secondsLeft;

      const increment = (finalValue - initialValue) / iteration;
      initialValue = initialValue + increment;
      circularBar.style.background = `conic-gradient(red ${
        (initialValue.toFixed(2) / 100) * 360
      }deg, #fff 0deg)`;
      playTickSound();
      if (secondsLeft <= 0) {
        secondsLeft = 60;
        remainingTime--;
        currentSeconds = secondsLeft;
        currentMinuts = remainingTime;
      }
    }

    if (i == exercises.length) {
      countdownElement.textContent = "Done!";
    }
    resolve();
  });
}

document.getElementById("run").addEventListener("click", async () => {
  let exercises = getExercises();
  isCountdownRunning = true;
  if (!resumeExercise) {
    initialValue = 0;
  }
  let index = resumeExercise ? currentExercise : 0;
  for (let i = index; i < exercises.length; i++) {
    const element = exercises[i];

    await countDown(element.time, element.name, i);
  }
  isCountdownRunning = false;
});

document.getElementById("stop").addEventListener("click", () => {
  isCountdownRunning = false;
  resumeExercise = true;
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
