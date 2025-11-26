import { IoMailSharp } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";

export default function About() {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-left">
        <h1 className="text-3xl font-bold mb-6">About</h1>
        <p className="text-md leading-relaxed mb-6">
          Hello! <br />
          I'm <span className="font-semibold">Yanran Wang</span>, a passionate learner who enjoys exploring everything. <br />
          Also:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text mb-6">
          <li>Artificial Unintelligence</li>
          <li>Game Enthusiast</li>
          <li>Quick Learner</li>
        </ul>
        <p className="text-md text-text mb-8">
          currently studying at <a className="font-medium cursor-pointer text-text hover:text-blue-600" target="_blank" href="https://www.unsw.edu.au/">UNSW</a>.
        </p>
  
        <p className="text-text mb-12">
          This blog was created in 2025 as a small React project and now also serves as my digital study notebook.
        </p>
  
        <h1 className="text-3xl font-bold mb-4">Contact Me</h1>
  
        <a href="https://github.com/ll-msg" target="_blank" rel="noopener noreferrer" className="text-text flex items-center gap-2 hover:text-blue-600">
            <FaGithub /> Github: ll-msg 
        </a>
        <a href="mailto:wyr20031104@gmail.com" className="text-text flex items-center gap-2 mt-2 hover:text-blue-600">
            <IoMailSharp /> Email: wyr20031104@gmail.com
        </a>
      </div>
    );
  }
  