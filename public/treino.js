const socket = io();

const form = document.getElementById("training-form");
const textInput = document.getElementById("text-input");
const submitButton = form.querySelector("button");
const statusContainer = document.getElementById("status-container");
const statusText = document.getElementById("status-text");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const textToTrain = textInput.value;

  if (textToTrain.trim()) {
    socket.emit("add training text", textToTrain);
    submitButton.disabled = true;
    textInput.disabled = true;
    submitButton.textContent = "Processando...";

    statusContainer.classList.remove("hidden", "success", "error");
    statusText.textContent = "Enviando texto para o servidor...";
  }
});

socket.on("training status", (data) => {
  statusContainer.classList.remove("hidden");
  statusText.textContent = data.message;

  if (data.success || data.error) {
    submitButton.disabled = false;
    textInput.disabled = false;
    submitButton.textContent = "Adicionar à Base";

    if (data.success) {
      statusContainer.classList.add("success");
      textInput.value = ""; 
    }
    if (data.error) {
      statusContainer.classList.add("error");
    }
  }
});
