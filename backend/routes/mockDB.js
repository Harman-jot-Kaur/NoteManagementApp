// backend/mockDB.js
"use strict";

let notes = [
  { id: 1, title: "Demo Note 1", content: "This is a temporary note." },
  { id: 2, title: "Demo Note 2", content: "Another temporary note." },
];

module.exports = {
  getAll: () => notes,
  getById: (id) => notes.find((note) => note.id === parseInt(id)),
  create: (note) => {
    note.id = notes.length + 1;
    notes.push(note);
    return note;
  },
  update: (id, updated) => {
    const index = notes.findIndex((note) => note.id === parseInt(id));
    if (index >= 0) {
      notes[index] = { id: parseInt(id), ...updated };
      return notes[index];
    }
    return null;
  },
  delete: (id) => {
    const index = notes.findIndex((note) => note.id === parseInt(id));
    if (index >= 0) return notes.splice(index, 1);
    return null;
  },
};
