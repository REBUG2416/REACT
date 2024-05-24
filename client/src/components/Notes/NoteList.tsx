import { useState } from "react";
import useFetch from "./useFetch";
// Define the interface for a single note
interface Note {
  title: string;
  body: string;
  created_at: string;
  id: number;
}

// Define the interface for the props passed to the NoteList component
interface NoteProps {
  notes: Note[] | null; // Array of notes
  setNote: React.Dispatch<React.SetStateAction<Note[] | null>>; // Function to update notes
}

const NoteList = (props: NoteProps) => {
  // State variable to store the currently edited note
  const [editedNote, setEditedNote] = useState<Note>({
    id: -1,
    title: "",
    body: "",
    created_at: "",
  });

  // Destructure props to access notes and setNote
  const { notes, setNote } = props;

  // Function to add or edit notes
  const addEditNotes = (id: number) => {
    // If id is -1, it means it's a new note being added
    if (id === -1) {
      // Toggle the visibility of the edit section
      document.querySelector(".editSection")!.classList.toggle("active");

      // Set the edited note to a new empty note
      setEditedNote({
        id: notes!.length,
        title: "",
        body: "",
        created_at: new Date().toLocaleString(),
      });
    } else {
      // If id is not -1, it means an existing note is being edited
      // Toggle the visibility of the edit section
      if (!document.querySelector(".editSection")!.classList.toggle("active")) {
        document.querySelector(".editSection")!.classList.toggle("active");
      }

      // Get the selected note based on id
      const selectedNote = notes![id];

      // Set the edited note to the selected note
      setEditedNote({
        id: id,
        title: selectedNote.title,
        body: selectedNote.body,
        created_at: selectedNote.created_at,
      });
    }
  };

  // Function to save the edited note
  const saveNote = (id: number) => {
    // If id equals the length of notes array + 1, it means it's a new note being added
    if (id === notes!.length) {
      // Add the edited note to the notes array
      setNote([...notes!, editedNote]);

      fetch("https://notepad-1o3q.onrender.com/api/Notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedNote),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save note.");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Note has been added", data);
        })
        .catch((error) => {
          console.error("Error saving note:", error);
          // Handle error state or display an error message to the user
        });
    } else {
      // If id is not notes.length + 1, it means an existing note is being edited
      const selectedNote = notes![id];

      // Update the selected note with the edited note
      selectedNote.title = editedNote.title;
      selectedNote.body = editedNote.body;

          fetch("https://notepad-1o3q.onrender.com/api/Notes", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedNote),
          });
      // Update the notes array
      setNote(notes);
    }

    // Reset the editedNote state
    setEditedNote({
      id: -1,
      title: "",
      body: "",
      created_at: "",
    });

    // Hide the edit section
    document.querySelector(".editSection")!.classList.remove("active");
    document.querySelector(".editSection")!.classList.remove("active2");
    document.querySelector(".preview-section")!.classList.remove("active2");
  };

  // Function to delete a note
  const deleteNote = (id: number) => {
    fetch(`https://notepad-1o3q.onrender.com/api/Notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    // Filter out the deleted note from the notes array
    const updatedNotes = notes!.filter((note, index) => index !== id);

    // Update the notes array
    setNote(updatedNotes);

    // Reset the editedNote state
    setEditedNote({
      id: -1,
      title: "",
      body: "",
      created_at: "",
    });

    // Hide the edit section
    document.querySelector(".editSection")!.classList.remove("active");
    document.querySelector(".editSection")!.classList.remove("active2");
    document.querySelector(".preview-section")!.classList.remove("active2");
  };

  // Function to handle back button click
  const backBtn = () => {
    // Toggle the visibility of the edit section
    document.querySelector(".editSection")!.classList.remove("active");
    document.querySelector(".editSection")!.classList.remove("active2");
    document.querySelector(".preview-section")!.classList.remove("active2");
  };

  const fullScreen = () => {
    document.querySelector(".editSection")!.classList.toggle("active");
    document.querySelector(".editSection")!.classList.toggle("active2");
    document.querySelector(".preview-section")!.classList.toggle("active2");
  };

  // JSX to render the NoteList component
  return (
    <>
      <div className="notes-section">
        {/* Render the preview section */}
        <div className="preview-section">
          <div className="previews" data-aos="fade-up" data-aos-duration="1000">
            <div>
              {notes!.map((note, index) => (
                <li className="note-preview" key={index}>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                  <div>
                    <span>{note.created_at}</span>
                    <b>
                      <div className="preview-icons">
                        {/* Edit icon */}
                        <span
                          className="edit-icon"
                          onClick={() => {
                            addEditNotes(index);
                          }}
                        >
                          &#9998;
                        </span>
                        {/* Delete icon */}
                        <span
                          className="trash-icon"
                          onClick={() => {
                            deleteNote(index);
                          }}
                        >
                          &#128465;
                        </span>
                      </div>
                    </b>
                  </div>
                </li>
              ))}
            </div>
          </div>

          {/* Add notes button */}
          <div className="Section2">
            <button
              className="addBtn"
              onClick={() => {
                addEditNotes(-1);
              }}
            >
              +Add Notes...
            </button>
          </div>
        </div>
        {/* Render the edit section */}
        <div className="editSection">
          <div className="editTools">
            {/* Save button */}
            <button
              className="savebtn"
              onClick={() => {
                saveNote(editedNote.id);
              }}
            >
              &#128427;
            </button>
            {/* Note number */}
            <li className="note-number">{editedNote.id + 1}</li>
            {/* Back button */}
            <button className="cancelbtn" onClick={backBtn}>
              <span>back</span>&#12297;
            </button>
          </div>
          {/* Input field for note title */}
          <h3>
            <input
              className="note-header"
              type="text"
              value={editedNote.title}
              placeholder="ENTER YOUR TITLE"
              onChange={(e) =>
                setEditedNote({ ...editedNote, title: e.target.value })
              }
            />
          </h3>
          {/* Textarea for note body */}
          <div className="note-body-parent">
            <button onClick={fullScreen}>&#12296;</button>

            <textarea
              value={editedNote.body}
              className="note-body"
              placeholder="ENTER YOUR TEXT"
              onChange={(e) =>
                setEditedNote({ ...editedNote, body: e.target.value })
              }
            />
          </div>
          {/* Input field for note time */}
          <span>
            <input
              className="note-time"
              type="text"
              value={editedNote.created_at}
              onChange={(e) =>
                setEditedNote({ ...editedNote, created_at: e.target.value })
              }
            />
          </span>
        </div>
      </div>
      {/* Mobile footer */}
      <div className="mobile-footer">
        <span>{notes!.length} notes</span>
        <button
          className="addButton"
          onClick={() => {
            addEditNotes(-1);
          }}
        >
          +
        </button>
      </div>
    </>
  );
};

export default NoteList;
