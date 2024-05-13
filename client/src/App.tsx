import ListGroup from "./components/ListGroup";
import Message from "./components/Message";
import Button from "./components/Button/Button";
import Student from "./components/Student";
import List from "./components/Button/List2";

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Nav from "./components/Notes/navBar";
import Home from "./components/Notes/Home";
import First from "./components/Notes/First";
import About from "./components/Notes/About";
import Footer from "./components/Notes/Footer";
function App() {
  return (
    <>
      <Router>
        <div className="App">
          <div className="content">
            <Routes>
              <Route path="/" element={<FirstPage />} />
              <Route path="/Notes" element={<HomePage />} />
              <Route path="/About-us" element={<AboutPage />} />
            </Routes>
          </div>
        </div>

      </Router>


      {/*         <div><Message /></div>
      }
      <div>
        <ListGroup />
        <Student name="Spongebob" age={30} isStudent={true} />
        <Student name="Squidward" age={50} isStudent={false} />
        <Student name="Sandy " age={27} isStudent={true} />
        <Student name="Larry" />
        <List />
        <Button />
      </div> */}
    </>
  );
}

function FirstPage() {
  return (
    <>
<First />
    </>
  );
}

// Component for the "/Notes" route
function HomePage() {
  return (
    <>
      <Nav />
      <Home />
      <Footer />
    </>
  );
}

// Component for the "/About-us" route
function AboutPage() {
  return (
    <>
    <Nav />
    <About />
    <Footer />
    </>
  );
}

export default App;
