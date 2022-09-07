const { randomUUID } = require("crypto");

const notes = [
    {title: "Brush teeth",
     text: "use the new toothbrush",
     note_id: randomUUID(),
    },
];

module.exports = notes;