import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FileText, Send } from "lucide-react";

const MonthlyReport = () => {
  const { enrollmentId } = useParams();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({}); // <— store user input
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReportFields() {
      try {
        const res = await axios.get(`/api/v1/enrollment/fields/${enrollmentId}`);
        setFields(res.data.course.reportFields || []);
      } catch (err) {
        console.error("Failed to fetch fields", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReportFields();
  }, [enrollmentId]);

  // Handle input change for dynamic fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit for reports
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Example: teacher and student IDs might come from auth or enrollment data

      const payload = {
        enrollmentId,
        data: formValues
      };

      await axios.post("/api/v1/report", payload);

      alert("Report submitted successfully!");
      setFormValues({});
    } catch (err) {
      console.error("Failed to submit report", err);
      alert("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-secondary text-lg font-medium animate-pulse">
          Loading report fields...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary/10">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Monthly Report
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Complete your monthly progress report
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field._id} className="relative">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-primary mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.options.length > 0 ? (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  value={formValues[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                >
                  <option value="">Select...</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  rows={4}
                  value={formValues[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder={field.label}
                ></textarea>
              ) : (
                <input
                  type={field.type === "text" ? "text" : field.type}
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  value={formValues[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder={field.label}
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-secondary to-primary text-white font-semibold py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{submitting ? "Submitting..." : "Submit Report"}</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonthlyReport;
