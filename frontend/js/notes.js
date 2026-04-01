"use strict";

const API = "http://localhost:5000/api";

// ── Auth guard ───────────────────────────────────────────────
const token = localStorage.getItem("token");

let user = null;
try {
  user = JSON.parse(localStorage.getItem("user"));
} catch (e) {
  console.error("Invalid user in localStorage");
}

if (!token || !user) {
  window.location.href = "index.html";
}

// ── Wait for DOM ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── Welcome message ───────────────────────────────────────
  const welcomeEl = document.getElementById("welcomeMsg");
  if (user && user.username) {
    welcomeEl.textContent = `Hello, ${user.username}!`;
  } else {
    welcomeEl.textContent = "Hello!";
  }

  // ── State ────────────────────────────────────────────────
  let allNotes = [];

  // ── Helpers ──────────────────────────────────────────────
  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString();
  }

  function resetForm() {
    document.getElementById("noteId").value = "";
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
  }

  function showNoteError(msg) {
    const el = document.getElementById("noteError");
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  function clearNoteError() {
    const el = document.getElementById("noteError");
    el.textContent = "";
    el.classList.add("hidden");
  }

  // ── Load notes ───────────────────────────────────────────
  async function loadNotes() {
    const notesList = document.getElementById("notesList");
    const loadingMsg = document.getElementById("loadingMsg");

    try {
      loadingMsg.textContent = "Loading your notes...";

      const res = await fetch(`${API}/notes`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        loadingMsg.textContent = "Failed to load notes.";
        return;
      }

      const notes = await res.json();
      allNotes = notes;

      if (!notes.length) {
        loadingMsg.textContent = "No notes found.";
        notesList.innerHTML = "<p>No notes yet.</p>";
        return;
      }

      loadingMsg.textContent = "";
      renderNotes(notes);
    } catch (err) {
      console.error(err);
      loadingMsg.textContent = "Server error.";
    }
  }

  // ── Render notes ─────────────────────────────────────────
  function renderNotes(notes) {
    const notesList = document.getElementById("notesList");
    const search = document.getElementById("searchInput").value.toLowerCase();

    notesList.innerHTML = "";

    notes.forEach((note) => {
      let title = note.title;
      let content = note.content;

      // 🔍 Safe highlight
      if (search) {
        const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${safeSearch})`, "gi");

        title = title.replace(regex, `<mark>$1</mark>`);
        content = content.replace(regex, `<mark>$1</mark>`);
      }

      const div = document.createElement("div");
      div.className = "note-item";

      div.innerHTML = `
        <h3>📝 ${title}</h3>
        <p>${content}</p>
        <small>⏱ Last edited: ${formatDate(note.updated_at || note.created_at)}</small>
        <br/>
        <button onclick="editNote('${note.id}')">Edit</button>
        <button onclick="deleteNote('${note.id}')">Delete</button>
      `;

      notesList.appendChild(div);
    });
  }

  // ── Create / Update ──────────────────────────────────────
  document.getElementById("noteForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearNoteError();

    const id = document.getElementById("noteId").value;
    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();

    if (!title || !content) {
      return showNoteError("Both title and content are required.");
    }

    const url = id ? `${API}/notes/${id}` : `${API}/notes`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        return showNoteError("Failed to save note.");
      }

      resetForm();
      loadNotes();
    } catch (err) {
      console.error(err);
      showNoteError("Server error.");
    }
  });

  // ── Edit ────────────────────────────────────────────────
  async function editNote(id) {
    const res = await fetch(`${API}/notes/${id}`, {
      headers: authHeaders(),
    });

    const note = await res.json();

    document.getElementById("noteId").value = note.id;
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteContent").value = note.content;
  }

  // ── Delete ──────────────────────────────────────────────
  async function deleteNote(id) {
    if (!confirm("Delete this note?")) return;

    await fetch(`${API}/notes/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    loadNotes();
  }

  // ── Search ──────────────────────────────────────────────
  function filterNotes() {
    const search = document.getElementById("searchInput").value.toLowerCase();

    const filtered = allNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(search) ||
        n.content.toLowerCase().includes(search),
    );

    renderNotes(filtered);
  }

  // ── Logout ──────────────────────────────────────────────
  function logout() {
    localStorage.clear();
    window.location.href = "index.html";
  }

  // ── Expose to HTML ──────────────────────────────────────
  window.editNote = editNote;
  window.deleteNote = deleteNote;
  window.filterNotes = filterNotes;
  window.logout = logout;

  // ── INIT ────────────────────────────────────────────────
  loadNotes();
});
