import "./First.css"
import Writer from "./Writer";
import {Link} from "react-router-dom";
const First = () => {
    const showNav = false;
    
    return (
      <>
        <div className="Firstcontainer">
          <div className="div1">
            <span className="icon">
              <img src="/src/assets/history-book.png"></img>
              Webease
            </span>
            <Writer />
          </div>
          <div className="div2">
            <div data-aos="zoom-in">
              <h2>Get Started</h2>
              <Link to="/Notes">
                <button>Lets Go</button>
              </Link>
            </div>
            <div className="footer" data-aos="fade-right" data-aos-duration="1000">
              <img src="/src/assets/history-book.png"></img>
              <span>
                Terms of use <span>|</span>Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </>
    );
}
 
export default First;
