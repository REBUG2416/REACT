import { Fragment, useState } from "react";
import { MouseEvent } from "react";



function ListGroup() {
    const items = ["New Your", "San Francisco", "Tokyo", "London", "Paris"];
    //Hook
   const [selectedIndex, setSelectedIndex] = useState(-1);
  
    // Event handler 
    const handleClick = (event: MouseEvent)=> console.log(event);
  return (
    <>
      <h1>List Group</h1>
      {items.length === 0 && <p>Not Found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index ? "list-group-item active": "list-group-item"
            }
            key={item}
             
            onClick={()=>{setSelectedIndex(index);}}
          >
            {item}
          </li>
          // <li className="list-group-item active" key={item} onClick={handleCli ck}>
          //   {item}
          // </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
