import React, { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './App.css';

const checklistOptions = {
  'User Interface': ['React', 'HTML/CSS', 'Angular', 'Javascript'],
  Backend: ['NodeJS', 'Java', '.Net'],
  Database: ['MongoDB', 'Oracle', 'MySQL', 'Postgress'],
  Cloud: ['AWS'],
  Server: ['IBM WAS', 'IBM Liberty', 'Tomcat', 'JBoss'],
};

function App() {
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (tech) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    const newResponses = {};

    for (const tech of selectedTechs) {
      try {
        const res = await axios.post('http://localhost:5000/api/checklist', { tech });
        newResponses[tech] = res.data.response;
      } catch (err) {
        console.error(err);
        newResponses[tech] = '❌ Error fetching checklist.';
      }
    }

    setResponses(newResponses);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="checklist-box">
        <h2 className="heading">Deployment Checklist Chatbot</h2>

        <div className="tech-section">
          {Object.entries(checklistOptions).map(([category, techs]) => (
            <div className="category-row" key={category}>
              <div className="category-label">{category}:</div>
              <div className="checkbox-group">
                {techs.map((tech) => (
                  <label key={tech} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTechs.includes(tech)}
                      onChange={() => handleCheckboxChange(tech)}
                    />
                    {tech}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || selectedTechs.length === 0}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate Checklist'}
        </button>
      </div>

      {Object.entries(responses).length > 0 && (
        <div className="results-section">
          {Object.entries(responses).map(([tech, checklist]) => (
            <div key={tech} className="checklist-result">
              <h3>{tech} Checklist:</h3>
              <div
                className="checklist-output"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked.parse(checklist)),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;






