import React, { useState, useEffect } from 'react';

const Slotmanagement = () => {
  const [qrId, setQrId] = useState('');
  const [date, setDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [brandNames, setBrandNames] = useState([]);
  const [qrIds, setQrIds] = useState([]);
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [landingPages, setLandingPages] = useState([]); // State to hold landing pages
  const [selectedLandingPage, setSelectedLandingPage] = useState(''); // State for selected landing page
  const [redirectType, setRedirectType] = useState('url'); // State to track if URL or Landing Page is selected
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for showing success message

  useEffect(() => {
    // Fetch QR IDs
    const fetchQrIds = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/get_qrs');
        const data = await response.json();
        if (data.success && Array.isArray(data.Qrs)) {
          setQrIds(data.Qrs);
        } else {
          console.error('Invalid response format for QR IDs:', data);
        }
      } catch (error) {
        console.error('Error fetching QR IDs:', error);
      }
    };

    fetchQrIds();
  }, []);

  useEffect(() => {
    // Fetch brand names
    const fetchBrandNames = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/get_brand');
        const data = await response.json();
        if (data.success && Array.isArray(data.Brands)) {
          setBrandNames(data.Brands);
        } else {
          console.error("Error: Brands data is not in expected array format.");
        }
      } catch (error) {
        console.error('Error fetching brand names:', error);
      }
    };

    fetchBrandNames();
  }, []);

  // Fetch landing pages when "Landing Page" is selected
  useEffect(() => {
    if (redirectType === 'landingPage') {
      const fetchLandingPages = async () => {
        try {
          const response = await fetch('http://localhost:7000/api/get_landing_pages');
          const data = await response.json();
          if (data.success && Array.isArray(data.LandingPages)) {
            setLandingPages(data.LandingPages);
          } else {
            console.error("Error: Landing pages data is not in expected array format.");
          }
        } catch (error) {
          console.error('Error fetching landing pages:', error);
        }
      };

      fetchLandingPages();
    }
  }, [redirectType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If landing page is selected, use its ID, otherwise use the URL
    const formData = {
      qrId,
      brandId: selectedBrandName,
      date,
      startTime: slotTime,
      endTime,
      redirectionUrl: redirectType === 'url' ? redirectUrl : selectedLandingPage,
    };

    try {
      const response = await fetch('http://localhost:7000/api/add_slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessMessage(true); // Show success message after slot is successfully added
      } else {
        alert('Error saving slot. Please try again!');
      }
    } catch (error) {
      alert('Network error. Please try again!');
    }
  };

  return (
    <div className="page-content">
      <div className="page-title-box">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="page-title">
                <h4>QR Code Selection</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="page-content-wrapper">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* QR ID Dropdown */}
                    <div className="mb-3">
                      <label htmlFor="qrId" className="form-label">QR Slot Booking Form</label>
                      <select
                        id="qrId"
                        className="form-select"
                        value={qrId}
                        onChange={(e) => setQrId(e.target.value)}
                        required
                      >
                        <option value="">Select QR ID</option>
                        {qrIds.map((qr) => (
                          <option key={qr._id} value={qr.qrCodeId}>{qr.qrCodeId}</option>
                        ))}
                      </select>
                    </div>

                    {/* Brand Name Dropdown */}
                    <div className="mb-3">
                      <label htmlFor="brandName" className="form-label">Select Brand Name</label>
                      <select
                        id="brandName"
                        className="form-select"
                        value={selectedBrandName}
                        onChange={(e) => setSelectedBrandName(e.target.value)}
                        required
                      >
                        <option value="">Select Brand Name</option>
                        {brandNames.length > 0 ? (
                          brandNames.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                              {brand.brandName}
                            </option>
                          ))
                        ) : (
                          <option disabled>No brands available</option>
                        )}
                      </select>
                    </div>

                    {/* Date Input */}
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">Select Date</label>
                      <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>

                    {/* Slot Time Input */}
                    <div className="mb-3">
                      <label htmlFor="slotTime" className="form-label">Select Slot Time</label>
                      <input
                        type="time"
                        id="slotTime"
                        className="form-control"
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        required
                      />
                    </div>

                    {/* End Time Input */}
                    <div className="mb-3">
                      <label htmlFor="endTime" className="form-label">Select End Time</label>
                      <input
                        type="time"
                        id="endTime"
                        className="form-control"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>

                    {/* Redirect URL or Landing Page Selection */}
                    <div className="mb-3">
                      <label className="form-label">Select Redirection Type</label>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="url"
                          name="redirectType"
                          className="form-check-input"
                          value="url"
                          checked={redirectType === 'url'}
                          onChange={() => setRedirectType('url')}
                        />
                        <label htmlFor="url" className="form-check-label">Redirection URL</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="landingPage"
                          name="redirectType"
                          className="form-check-input"
                          value="landingPage"
                          checked={redirectType === 'landingPage'}
                          onChange={() => setRedirectType('landingPage')}
                        />
                        <label htmlFor="landingPage" className="form-check-label">Landing Page</label>
                      </div>
                    </div>

                    {/* Conditionally Render Redirection URL or Landing Page Input */}
                    {redirectType === 'url' ? (
                      <div className="mb-3">
                        <label htmlFor="redirectUrl" className="form-label">Redirect URL</label>
                        <input
                          type="url"
                          id="redirectUrl"
                          className="form-control"
                          value={redirectUrl}
                          onChange={(e) => setRedirectUrl(e.target.value)}
                          required
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label htmlFor="landingPage" className="form-label">Select Landing Page</label>
                        <select
                          id="landingPage"
                          className="form-select"
                          value={selectedLandingPage}
                          onChange={(e) => setSelectedLandingPage(e.target.value)}
                          required
                        >
                          <option value="">Select Landing Page</option>
                          {landingPages.length > 0 ? (
                            landingPages.map((page) => (
                              <option key={page._id} value={page._id}>{page.pageName}</option>
                            ))
                          ) : (
                            <option disabled>No landing pages available</option>
                          )}
                        </select>
                      </div>
                    )}

                    {/* Success Message */}
                    {showSuccessMessage && (
                      <div className="alert alert-success mb-3" role="alert">
                        Slot successfully added!
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
            </div> {/* end col */}
          </div> {/* end row */}
        </div>
      </div>
    </div>
  );
};

export default Slotmanagement;
