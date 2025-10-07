import { useState, useEffect } from 'react';
import { FileText, ChevronRight, Dot } from 'lucide-react';
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const MonthlyReports = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const user = useSelector(state => state.user);
  const { enrollmentId } = useParams();

  const getReports = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/v1/report/${enrollmentId}/${user.id}?page=${pageToLoad}&limit=8`
      );
      if (pageToLoad === 1) {
        setReports(res.data.reports);
      } else {
        setReports(prev => [...prev, ...res.data.reports]);
      }
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      getReports(1);
    }
  }, [user.id]);

  const handleSeeMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getReports(nextPage);
  };

  const handleReportClick = async (reportId) => {
    try {
      const response = await axios.get(`/api/v1/report/${reportId}/pdf`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Monthly_Report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 border-l-4 border-primary">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Monthly Reports
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                View and access all monthly reports
              </p>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              onClick={() => handleReportClick(report._id)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <FileText className="w-6 h-6 text-secondary" />
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-700 leading-none capitalize">{report.type}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {months[report.month.split("-")[1] - 1]}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {report.month.split("-")[0]}
                  </p>
                </div>
              </div>
              
              <div className="h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleSeeMore}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              {loading ? "Loading..." : "See More"}
            </button>
          </div>
        )}

        {/* Empty State */}
        {reports.length === 0 && !loading && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reports Available
            </h3>
            <p className="text-gray-600">
              Monthly reports will appear here once they are generated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReports;
