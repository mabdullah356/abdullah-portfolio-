import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutMe from "./components/AboutMe";
import ContactMe from "./components/Contact";
import RecentWorks from "./components/RecentWorks";
import Resume from "./components/Resume";
import Service from "./components/Service";
import Project from "./components/Project";

export default function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <Header />
      <div data-scroll-container>
        <Routes>
          <Route path="/" element={<AboutMe />} />
          <Route path="/contact" element={<ContactMe />} />
          <Route path="/recent-work" element={<RecentWorks />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/services" element={<Service />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}
