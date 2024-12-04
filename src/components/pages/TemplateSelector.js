import React, { useState, useEffect } from 'react';

const EditTemplate = () => {
  const [fileUrl, setFileUrl] = useState('');
  const [brandTitle, setBrandTitle] = useState('');
  const [slug, setSlug] = useState('');

  const [titles, setTitles] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [links, setLinks] = useState([]);
  const [images, setImages] = useState([]);

  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateNameParam = urlParams.get('templateName');

    if (templateNameParam) {
      setFileUrl(`http://localhost:8000/api/default/${templateNameParam}`);

      const fetchHtmlContent = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/default/${templateNameParam}`);
          if (response.ok) {
            const html = await response.text();
            setHtmlContent(html);
          } else {
            console.error('Error fetching HTML content:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching HTML content:', error);
        }
      };

      fetchHtmlContent();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slug) {
      alert('Please enter a slug!');
      return;
    }

    const contentArray = [
      ...titles.map((t) => ({ type: 'text', data: t })),
      ...descriptions.map((d) => ({ type: 'text', data: d })),
      ...links.map((l) => ({ type: 'link', data: l })),
      ...images.map((img) => (img ? { type: 'image', data: img } : null)).filter(Boolean),
    ];

    const formData = {
      title: brandTitle,
      slug: slug.toLowerCase().replace(/ /g, '-'),
      template: new URLSearchParams(window.location.search).get('templateName'),
      contentArray,
    };

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form submitted successfully');

        const updatedHtmlResponse = await fetch(`http://localhost:8000/api/get/${slug}`);
        if (updatedHtmlResponse.ok) {
          const updatedHtml = await updatedHtmlResponse.text();
          setHtmlContent(updatedHtml);
        } else {
          console.error('Error fetching updated HTML content:', updatedHtmlResponse.statusText);
        }
      } else {
        const errorText = await response.text();
        console.error('Error submitting form:', errorText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type) => {
    switch (type) {
      case 'title':
        setTitles([...titles, '']);
        break;
      case 'description':
        setDescriptions([...descriptions, '']);
        break;
      case 'link':
        setLinks([...links, '']);
        break;
      case 'image':
        setImages([...images, '']);
        break;
      default:
        break;
    }
  };

  const handleChange = (index, field, value) => {
    switch (field) {
      case 'title':
        setTitles(titles.map((t, i) => (i === index ? value : t)));
        break;
      case 'description':
        setDescriptions(descriptions.map((d, i) => (i === index ? value : d)));
        break;
      case 'link':
        setLinks(links.map((l, i) => (i === index ? value : l)));
        break;
      case 'image':
        setImages(images.map((img, i) => (i === index ? value : img)));
        break;
      default:
        break;
    }
  };

  const handleRemove = (index, field) => {
    switch (field) {
      case 'title':
        setTitles(titles.filter((_, i) => i !== index));
        break;
      case 'description':
        setDescriptions(descriptions.filter((_, i) => i !== index));
        break;
      case 'link':
        setLinks(links.filter((_, i) => i !== index));
        break;
      case 'image':
        setImages(images.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  // Handle image upload and preview
  const handleImageUpload = (index, event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result; // Store the image preview URL
        setImages(newImages);
      };
      reader.readAsDataURL(file); // Read the file as data URL (for preview)
    }
  };

  return (
    <div className="page-content">
      <div className="page-title-box">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="page-title">
                <h4>Edit Template</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="page-content-wrapper" style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '60%', paddingRight: '5%', overflowY: 'auto', maxHeight: '80vh' }}>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="brandTitle" className="form-label">Title</label>
                    <input
                      type="text"
                      id="brandTitle"
                      className="form-control"
                      value={brandTitle}
                      onChange={(e) => setBrandTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="slug" className="form-label">Slug</label>
                    <input
                      type="text"
                      id="slug"
                      className="form-control"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                  </div>

                  <div className="btn-group me-1 mt-1">
                    <button
                      type="button"
                      className="btn btn-success dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Add Content <i className="mdi mdi-chevron-down"></i>
                    </button>
                    <div className="dropdown-menu">
                      <button className="dropdown-item" type="button" onClick={() => handleAdd('title')}>Add Title</button>
                      <button className="dropdown-item" type="button" onClick={() => handleAdd('description')}>Add Description</button>
                      <button className="dropdown-item" type="button" onClick={() => handleAdd('link')}>Add Link</button>
                      <button className="dropdown-item" type="button" onClick={() => handleAdd('image')}>Add Image</button>
                    </div>
                  </div>

                  {titles.map((title, index) => (
                    <div key={index} className="mb-3">
                      <label htmlFor={`title-${index}`} className="form-label">Title {index + 1}</label>
                      <input
                        type="text"
                        id={`title-${index}`}
                        className="form-control"
                        value={title}
                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-danger mt-2"
                        onClick={() => handleRemove(index, 'title')}
                      >
                        Remove Title
                      </button>
                    </div>
                  ))}

                  {descriptions.map((description, index) => (
                    <div key={index} className="mb-3">
                      <label htmlFor={`description-${index}`} className="form-label">Description {index + 1}</label>
                      <input
                        type="text"
                        id={`description-${index}`}
                        className="form-control"
                        value={description}
                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-danger mt-2"
                        onClick={() => handleRemove(index, 'description')}
                      >
                        Remove Description
                      </button>
                    </div>
                  ))}

                  {links.map((link, index) => (
                    <div key={index} className="mb-3">
                      <label htmlFor={`link-${index}`} className="form-label">Link {index + 1}</label>
                      <input
                        type="text"
                        id={`link-${index}`}
                        className="form-control"
                        value={link}
                        onChange={(e) => handleChange(index, 'link', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-danger mt-2"
                        onClick={() => handleRemove(index, 'link')}
                      >
                        Remove Link
                      </button>
                    </div>
                  ))}

                  {images.map((image, index) => (
                    <div key={index} className="mb-3">
                      <label htmlFor={`image-${index}`} className="form-label">Image {index + 1}</label>
                      <input
                        type="file"
                        id={`image-${index}`}
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                      {image && (
                        <div>
                          <img src={image} alt={`preview-${index}`} style={{ maxWidth: '100px', marginTop: '10px' }} />
                        </div>
                      )}
                      <button
                        type="button"
                        className="btn btn-danger mt-2"
                        onClick={() => handleRemove(index, 'image')}
                      >
                        Remove Image
                      </button>
                    </div>
                  ))}

                  <button type="submit" className="btn btn-success">Submit</button>
                </form>
              </div>
            </div>
          </div>

          <div
            style={{
              width: '30%',
              position: 'sticky',
              top: '20px',
              height: 'auto',
              maxHeight: '90vh',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '667px',
                maxWidth: '375px',
                margin: 'auto',
                border: '16px solid #e7e7e7',
                borderRadius: '40px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#fff',
                overflow: 'hidden',
              }}
            >
              {loading ? (
                <p style={{ textAlign: 'center', color: '#999' }}>Loading template...</p>
              ) : htmlContent ? (
                <iframe
                  srcDoc={htmlContent}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="Mobile Template Preview"
                />
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>No template selected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;
