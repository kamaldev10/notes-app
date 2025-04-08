import { notesData } from "../data/notes-data.js";
import "./app-bar.js";
import "./footer-bar.js";

const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button"),
  titleError = document.getElementById("title-error");

const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
const notesMap = new Map();

notesData.forEach((note) => notesMap.set(note.id, note));
storedNotes.forEach((note) => {
  if (!notesMap.has(note.id)) notesMap.set(note.id, note);
});

const notes = Array.from(notesMap.values());

let isUpdate = false,
  updateId;

function showNotes() {
  if (!notes || notes.length === 0) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());

  notes
    .slice()
    .reverse()
    .forEach((note) => {
      const filterBody = note.body?.replaceAll("\n", "<br/>") || "";
      const liTag = `<li class="note">
        <div class="details">
          <p>${note.title}</p>
          <span>${filterBody}</span>
        </div>
        <div class="bottom-content">
          <span>${new Date(note.createdAt).toLocaleDateString()}</span>
          <div class="settings">
            <i class="uil uil-ellipsis-h"></i>
            <ul class="menu">
              <li onclick="updateNote('${
                note.id
              }')"><i class="uil uil-pen"></i>Edit</li>
              <li onclick="deleteNote('${
                note.id
              }')"><i class="uil uil-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>`;
      addBox.insertAdjacentHTML("afterend", liTag);
    });

  setupMenuListeners();
}

function setupMenuListeners() {
  document.querySelectorAll(".settings i").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const menu = e.target.parentElement;
      menu.classList.add("show");
      document.addEventListener("click", (event) => {
        if (event.target.tagName !== "I" && event.target !== icon) {
          menu.classList.remove("show");
        }
      });
    });
  });
}

window.deleteNote = function (id) {
  const confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;

  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
  }
};

window.updateNote = function (id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  isUpdate = true;
  updateId = id;

  addBox.click();
  titleTag.value = note.title;
  descTag.value = note.body;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
};

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!validateTitle()) return;

  const title = titleTag.value.trim();
  const body = descTag.value.trim();

  if (title || body) {
    const noteInfo = {
      id: isUpdate ? updateId : `notes-${Date.now()}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      const index = notes.findIndex((note) => note.id === updateId);
      if (index !== -1) notes[index] = noteInfo;
      isUpdate = false;
      updateId = null;
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});

titleTag.addEventListener("input", () => {
  validateTitle();
});

function validateTitle() {
  const value = titleTag.value.trim();
  if (/^\d+$/.test(value)) {
    titleError.textContent = "Title tidak boleh hanya angka!";
    return false;
  } else if (value.length === 0) {
    titleError.textContent = "Title tidak boleh kosong!";
    return false;
  } else {
    titleError.textContent = "";
    return true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showNotes();
  addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if (window.innerWidth > 660) titleTag.focus();
    validateTitle();
  });

  closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
    titleError.textContent = "";
  });
});
