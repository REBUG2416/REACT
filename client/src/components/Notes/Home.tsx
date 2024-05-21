import React, { useEffect, useState } from "react";
import NoteList from "./NoteList";
import useFetch from "./useFetch";

interface Note {
  title: string;
  body: string;
  created_at: string;
  id: number;
}

const Home = () => {
/*   const {
    data: notes,
    isPending,
    setData: setNotes,
  } = useFetch<Note[]>("http://localhost:5000/api/notes",{
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});
 */
 const [notes, setNotes] = useState<Note[] | null>([{ title: "", body: "", created_at: "", id: 0 }]);

  return (
    <div className="home">
{/*       {isPending && <div className="loading-screen"><div className="loader"></div></div>}
 */}     <NoteList notes={notes} setNote={setNotes} />
   </div>
  );
};

export default Home;
