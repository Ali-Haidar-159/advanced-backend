"use strict";

const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const todoModal = document.querySelector("[data-todo-modal]");
const todoForm = document.querySelector("[data-todo-form]");
const openModalButtons = document.querySelectorAll("[data-open-modal]");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
const tagInputs = Array.from(todoForm.querySelectorAll("[data-tag-name]"));
const tagSelectionError = document.querySelector("#tag-selection-error");
const detailsBackdrop = document.querySelector("[data-details-backdrop]");
const detailsTitle = document.querySelector("[data-details-title]");
const detailsDescription = document.querySelector("[data-details-description]");
const detailsTags = document.querySelector("[data-details-tags]");
const detailsStatus = document.querySelector("[data-details-status]");
const closeDetailsButton = document.querySelector("[data-close-details]");
const todoCards = document.querySelectorAll("[data-todo-card]");
const todoCountElements = document.querySelectorAll("[data-todo-count]");
const emptyTodosMessage = document.querySelector("[data-empty-todos]");
const supportedTagColors = new Set(["red", "orange", "green", "blue", "purple", "teal", "gray"]);
let detailsTrigger;

function openTodoModal() {
  modalBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  todoModal.querySelector('input[name="title"]').focus();
}

function closeTodoModal() {
  modalBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
}

function closeDetailsModal() {
  detailsBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
  if (detailsTrigger) {
    detailsTrigger.focus();
    detailsTrigger = null;
  }
}

async function openTodoDetails(todoId, trigger) {
  detailsTrigger = trigger;
  detailsTitle.textContent = "Loading todo...";
  detailsDescription.textContent = "";
  detailsTags.replaceChildren();
  detailsStatus.hidden = true;
  detailsBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  closeDetailsButton.focus();

  try {
    const response = await fetch(`/todos/${encodeURIComponent(todoId)}`, {
      headers: { Accept: "application/json" },
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to load todo details.");
    }

    detailsTitle.textContent = result.todo.title;
    detailsDescription.textContent = result.todo.description;

    (result.todo.todoTags || []).forEach(({ tag }) => {
      const color = typeof tag.color === "string" ? tag.color.toLowerCase() : "";
      const tagElement = document.createElement("span");
      tagElement.className = `todo-tag todo-tag--${supportedTagColors.has(color) ? color : "gray"}`;
      tagElement.textContent = tag.name;
      detailsTags.append(tagElement);
    });
  } catch (error) {
    console.error("Unable to load todo details:", error);
    detailsTitle.textContent = "Todo details unavailable";
    detailsStatus.textContent = error.message || "Unable to load todo details. Please try again.";
    detailsStatus.hidden = false;
  }
}

async function deleteTodo(todoCard, deleteButton) {
  if (!window.confirm("Are you sure you want to delete this todo?")) {
    return;
  }

  deleteButton.disabled = true;

  try {
    const response = await fetch("/todos/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: todoCard.dataset.todoId }),
    });
    const result = response.headers.get("content-type")?.includes("application/json")
      ? await response.json()
      : {};

    if (!response.ok) {
      throw new Error(result.message || "Unable to delete this todo.");
    }

    todoCard.remove();
    const remainingTodos = document.querySelectorAll("[data-todo-card]").length;
    todoCountElements.forEach((element) => {
      element.textContent = String(remainingTodos);
    });
    emptyTodosMessage.hidden = remainingTodos !== 0;
  } catch (error) {
    console.error("Unable to delete todo:", error);
    window.alert(error.message || "Unable to delete this todo. Please try again.");
    deleteButton.disabled = false;
  }
}

openModalButtons.forEach((button) => {
  button.addEventListener("click", openTodoModal);
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeTodoModal);
});

closeDetailsButton.addEventListener("click", closeDetailsModal);

todoCards.forEach((card) => {
  card.addEventListener("click", () => {
    openTodoDetails(card.dataset.todoId, card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    openTodoDetails(card.dataset.todoId, card);
  });

  card.querySelector("[data-delete-todo]").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    deleteTodo(card, event.currentTarget);
  });
});

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeTodoModal();
  }
});

detailsBackdrop.addEventListener("click", (event) => {
  if (event.target === detailsBackdrop) {
    closeDetailsModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) {
    closeTodoModal();
  }
  if (event.key === "Escape" && !detailsBackdrop.hidden) {
    closeDetailsModal();
  }
});

todoForm.addEventListener("submit", (event) => {
  todoForm.querySelectorAll("[data-generated-tag-input]").forEach((input) => input.remove());

  const selectedTags = tagInputs.filter((input) => input.checked);

  if (selectedTags.length === 0) {
    event.preventDefault();
    tagSelectionError.hidden = false;
    tagInputs[0].focus();
    return;
  }

  tagSelectionError.hidden = true;

  selectedTags.forEach((tag, index) => {
    [
      ["name", tag.dataset.tagName],
      ["color", tag.dataset.tagColor],
    ].forEach(([property, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = `tags[${index}][${property}]`;
      input.value = value;
      input.dataset.generatedTagInput = "";
      todoForm.append(input);
    });
  });
});

tagInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (tagInputs.some((tag) => tag.checked)) {
      tagSelectionError.hidden = true;
    }
  });
});
