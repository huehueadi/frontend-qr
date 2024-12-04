import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TemplateShowcase() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); // State to store the fetched files
  const [loading, setLoading] = useState(true); // Loading state for fetching files
  const [error, setError] = useState(null); // Error state for handling API errors

  // Fetch files from the backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/getall'); // API URL
      setFiles(response.data.allFilesUrl); // Update state with the fetched files
      setLoading(false); // Set loading to false after fetching
    } catch (err) {
      setError('Failed to fetch files');
      setLoading(false); // Set loading to false on error
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles(); // Fetch files when the component mounts
  }, []);

  // Handler for the "Edit Template" button
  const handleEdit = (templateName) => {
    console.log(`Edit template with name: ${templateName}`);
    // Navigate to the landing page editor with templateName as a query parameter
    navigate(`/landing-page-editor?templateName=${templateName}`);
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-title-box">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="page-title">
                <h4>Template Showcase</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="container-fluid">
        <div className="page-content-wrapper">
          <div className="row">
            {/* Template Cards */}
            {loading ? (
              <p>Loading templates...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              files.map((template) => (
                <div className="col-md-4" key={template._id}> {/* Use _id as key */}
                  <div className="card">
                    <div className="card-body">
                      <div className="template-screenshot">
                        <img
                          src={template.screenshot} // Use the screenshot URL from API
                          alt={`Template ${template.name}`} // Use template name as alt text
                          className="img-fluid rounded"
                        />
                      </div>
                      <h5 className="mt-3 text-center">{template.name}</h5> {/* Display template name */}
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEdit(template.name)} // Pass the name for navigation
                        >
                          Edit Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateShowcase;
