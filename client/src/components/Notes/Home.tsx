import React from "react";
import NoteList from "./NoteList";
import useFetch from "./useFetch";

interface Note {
  title: string;
  body: string;
  created_at: string;
  id: number;
}

const Home = () => {
  const {
    data: notes,
    isPending,
    setData: setNotes,
  } = useFetch<Note[]>("https://notepad-1o3q.onrender.com//api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div className="home">
      {isPending && (
        <div className="loading-screen">
          <div className="loader"></div>
        </div>
      )}
      {notes && <NoteList notes={notes} setNote={setNotes} />}
    </div>
  );
};

export default Home;
