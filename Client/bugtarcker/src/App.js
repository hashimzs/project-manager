import react from "react";
import Login from "./components/login"
import Dashboard from './components/dashboard'
import Projects from './components/projects'
import Project from './components/project'
import Profile from './components/profile'
import Category from "./components/category";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Home from "./components/home";
function App() {
  return (
    <section>
      <Router>
        <Routes>
              <Route exact path="/" element={<Home/>}>
                  <Route exact path="/" element={<Dashboard></Dashboard>}></Route>
                  <Route exact path="/projects"element={<Projects/>}></Route>
                  <Route excat path="projects/:project_id"element={<Project/>}>
                    <Route  path="category/:cate" element={<Category></Category>}></Route>
                  </Route>
                  <Route excat path="/profile"element={<Profile/>}></Route>
              </Route>

              <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </Router>
      
    </section>
  );
}

export default App;
