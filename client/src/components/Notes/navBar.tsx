import { isHtmlElement } from "react-router-dom/dist/dom";
import "./navBar.css";
import {useState} from 'react';
import {Link} from "react-router-dom"

function Nav() {

const handleClick = (name: String) =>{
console.log("Hello,Bugs and ",name);

document.querySelector(".Hamburger")!.classList.toggle("active");
document.querySelector(".navLinks")!.classList.toggle("active");


}

  return (
    <>
      <div className="nav">
        <div className="navLogo">
          <img src="/src/assets/history-book.png"></img>
          <i>
            <a>Webease</a>
          </i>
        </div>
        <div className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/Notes">My Notes</Link>
          <Link to="/About-us">About</Link>
        </div>
        <div className="navIcons">
          <div></div>
          <i>&#128269;</i>
          <i>&#128260;</i>
        </div>
        <div className="Hamburger" onClick={() => handleClick("John")}>
          <span id="bar"></span>
          <span id="bar"></span>
          <span id="bar"></span>
        </div>
      </div>
    </>
  );
}

export default Nav;
