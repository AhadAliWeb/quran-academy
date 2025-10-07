import { useState } from 'react';
import { Save, FileText } from 'lucide-react';
import { useParams } from 'react-router';
import axios from 'axios';


const GeneralEvaluation = () => {
  const [formData, setFormData] = useState({
    attendance: '',
    discipline: '',
    homework: '',
    engagement: '',
    remarks: ''
  });

  const [submitting, setSubmitting] = useState(false)

  const { enrollmentId } = useParams()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {

      const payload = {
        enrollmentId,
        data: formData,
        type: "evaluation"
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

  const evaluationFields = [
    { id: 'attendance', label: 'Attendance & Punctuality', name: 'attendance' },
    { id: 'discipline', label: 'Discipline & Attitude', name: 'discipline' },
    { id: 'homework', label: 'Homework Completion', name: 'homework' },
    { id: 'engagement', label: 'Engagement & Effort', name: 'engagement' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              General Evaluation
            </h1>
          </div>
          <p className="text-white/90 text-sm md:text-base ml-0 md:ml-14">
            Complete the student's general evaluation form
          </p>
        </div>

        {/* Evaluation Form */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Standard Evaluation Fields */}
            {evaluationFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label 
                  htmlFor={field.id}
                  className="block text-sm md:text-base font-semibold text-gray-700"
                >
                  {field.label}:
                </label>
                <input
                  type="text"
                  id={field.id}
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-secondary transition-colors text-sm md:text-base"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}

            {/* Instructor's Overall Remarks */}
            <div className="space-y-2">
              <label 
                htmlFor="remarks"
                className="block text-sm md:text-base font-semibold text-gray-700"
              >
                Instructor's Overall Remarks:
              </label>
              <textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows="6"
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-secondary transition-colors resize-none text-sm md:text-base"
                placeholder="Enter overall remarks about the student's performance..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors shadow-md hover:shadow-lg text-sm md:text-base"
            >
              {submitting ? 
                  `Saving ...`    
              : (
                  <>
                  <Save className="w-4 h-4 md:w-5 md:h-5" />
                  Save Evaluation
                  </>
                )
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralEvaluation