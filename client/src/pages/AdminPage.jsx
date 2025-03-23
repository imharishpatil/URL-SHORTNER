import React, { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all URLs data for the admin page
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/admin/urls`, {
          withCredentials: true, // Send cookies with the request if needed
        });
        setUrls(response.data);
        setLoading(false);
      } catch (error) {
        console.log("server err : ", error);
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  // Render the table for admin
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {loading ? (
        <p className="text-xl text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white border border-gray-300 rounded-md shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Original URL</th>
                <th className="py-2 px-4 text-left">Short URL</th>
                <th className="py-2 px-4 text-left">Generated Date</th>
                <th className="py-2 px-4 text-left">User Name</th>
                <th className="py-2 px-4 text-left">Total Clicks</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((urlData, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{urlData.originalUrl}</td>
                  <td className="py-2 px-4">
                    <a
                      href={`${BACKEND_URL}/url/${urlData.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {`${BACKEND_URL}/url/${urlData.shortId}`}
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(urlData.createdDate).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{urlData.userName}</td>
                  <td className="py-2 px-4">{urlData.totalClicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
