import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [generatedUrls, setGeneratedUrls] = useState([]); // Ensure it's an array
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const navigate = useNavigate();

  // Check if user is logged in (via cookies or token)
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = Cookies.get("token") || localStorage.getItem("token"); // Check cookies and localStorage

      if (token) {
        try {
          // Send token to backend to check if it's valid
          const response = await axios.get(`${BACKEND_URL}/user/profile`, {
            withCredentials: true, // Send cookies with request if using cookies
            headers: {
              Authorization: `Bearer ${token}`, // Send token in header if stored in localStorage
            },
          });

          if (response.data.loggedIn) {
            setIsLoggedIn(true); // Set login status
            fetchGeneratedUrls(); // Fetch URLs if the user is logged in
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false); // Ensure state is set to false when no token
      }
    };

    checkLoginStatus(); // Run the login check when the component mounts
  }, []); // Run only once when the component mounts

  // Fetch generated URLs when the component mounts or user logs in
  const fetchGeneratedUrls = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/url/urls`, {
        withCredentials: true,
      });

      if (Array.isArray(response.data)) {
        const formattedUrls = response.data.map((urlData) => ({
          originalUrl: urlData.redirectURL || "N/A",
          shortUrl: `${BACKEND_URL}/url/${urlData.shortId}` || "N/A", // Fix shortUrl link
          totalClicks: urlData.visitHistory?.length ?? 0,
        }));

        setGeneratedUrls(formattedUrls);
      } else {
        setGeneratedUrls([]);
      }
    } catch (error) {
      setGeneratedUrls([]);
    }
  };

  // Handle URL submission
  const handleGenerateUrl = async () => {
    if (!url) {
      setErrorMessage("URL cannot be empty");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Make request to backend to generate the URL
      const response = await axios.post(
        "http://localhost:5000/url",
        { url },
        { withCredentials: true }
      );

      // Update the table with the new generated URL
      setGeneratedUrls((prevUrls) => [
        ...prevUrls,
        {
          shortId: response.data.shortId,
          shortUrl: response.data.shortUrl,
          totalClicks: response.data.totalClicks,
          originalUrl: url,
        },
      ]);

      setUrl("");
    } catch (error) {
      if (error.response && error.response.data.message === "Login First!") {
        alert("Please log in to generate a URL.");
        navigate("/login");
      } else {
        console.error("Error generating URL:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate a Short URL</h1>

        {/* URL Input and Generate Button */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg mb-4 sm:mb-0"
            placeholder="Enter the URL to shorten"
          />
          <button
            onClick={handleGenerateUrl}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate URL"}
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        {/* Table for Generated URLs */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full table-auto bg-white border border-gray-300 rounded-md shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Original URL</th>
                <th className="py-2 px-4 text-left">Short URL</th>
                <th className="py-2 px-4 text-left">Total Clicks</th>
              </tr>
            </thead>
            <tbody>
              {generatedUrls.length > 0 ? (
                generatedUrls.map((urlData, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{urlData.originalUrl}</td>
                    <td className="py-2 px-4">
                      <a
                        href={urlData.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {urlData.shortUrl}
                      </a>
                    </td>
                    <td className="py-2 px-4">{urlData.totalClicks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-2 px-4 text-center">
                    No URLs generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Login/Signup Buttons */}
        {!isLoggedIn && (
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg mr-4"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-green-500 text-white rounded-lg"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
