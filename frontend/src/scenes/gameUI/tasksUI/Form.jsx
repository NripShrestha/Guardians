import { useState } from "react";
import { useMission } from "../../missions/MissionContext";

export default function FormPopup() {
  const { mission, setMission } = useMission();
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    email: "",
    mobile: "",
    emailPassword: "",
    guardianEmailPassword: "",
    socialMediaPassword: "",
    bankAccount: "",
    atmPin: "",
    parentNationalId: "",
  });

  const [errors, setErrors] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  const [unsafeDataGiven, setUnsafeDataGiven] = useState({
    emailPassword: false,
    guardianEmailPassword: false,
    socialMediaPassword: false,
    bankAccount: false,
    atmPin: false,
    parentNationalId: false,
  });

  const sections = [
    {
      title: "Personal Information",
      description: "Basic personal details",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          placeholder: "Full name",
          required: true,
          safe: true,
          helpText: "As per official docs",
        },
        {
          id: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          required: true,
          safe: true,
          helpText: "DD/MM/YYYY",
        },
        {
          id: "gender",
          label: "Gender",
          type: "select",
          options: ["", "Male", "Female", "Other", "Prefer not to say"],
          required: false,
          safe: true,
        },
        {
          id: "nationality",
          label: "Nationality",
          type: "text",
          placeholder: "Citizenship",
          required: false,
          safe: true,
        },
      ],
    },
    {
      title: "Contact Information",
      description: "How can we reach you?",
      fields: [
        {
          id: "email",
          label: "Email Address",
          type: "email",
          placeholder: "example@email.com",
          required: true,
          safe: true,
        },
        {
          id: "mobile",
          label: "Mobile Number",
          type: "tel",
          placeholder: "+977 XXXXXXXXXX",
          required: false,
          safe: true,
        },
      ],
    },
    {
      title: "Security Verification",
      description: "Additional account security",
      fields: [
        {
          id: "emailPassword",
          label: "Personal Email Password",
          type: "password",
          required: false,
          safe: false,
          warning: true,
        },
        {
          id: "guardianEmailPassword",
          label: "Guardian's Email Password",
          type: "password",
          required: false,
          safe: false,
          warning: true,
        },
        {
          id: "socialMediaPassword",
          label: "Social Media Password",
          type: "password",
          required: false,
          safe: false,
          warning: true,
        },
      ],
    },
    {
      title: "Financial Information",
      description: "For fees and refunds",
      fields: [
        {
          id: "bankAccount",
          label: "Bank Account Number",
          type: "text",
          required: false,
          safe: false,
          warning: true,
        },
        {
          id: "atmPin",
          label: "ATM / Debit Card PIN",
          type: "password",
          required: false,
          safe: false,
          warning: true,
        },
        {
          id: "parentNationalId",
          label: "Parent's National ID",
          type: "text",
          required: false,
          safe: false,
          warning: true,
        },
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (unsafeDataGiven.hasOwnProperty(name)) {
      setUnsafeDataGiven((prev) => ({ ...prev, [name]: value.trim() !== "" }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateSection = () => {
    const currentFields = sections[currentSection].fields;
    const newErrors = {};
    currentFields.forEach((field) => {
      if (field.required && !formData[field.id].trim()) {
        newErrors[field.id] = "Required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection() && currentSection < sections.length - 1)
      setCurrentSection(currentSection + 1);
  };
  const handlePrevious = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const handleSubmit = () => {
    if (!validateSection()) return;
    const failedTest = Object.values(unsafeDataGiven).some((value) => value);
    setMission({
      ...mission,
      stage: "RETURN_TO_MANAGER",
      result: failedTest ? "FAIL" : "PASS",
      unsafeFields: Object.keys(unsafeDataGiven).filter(
        (key) => unsafeDataGiven[key],
      ),
    });
  };

  const handleCancel = () => {
    setMission({ ...mission, stage: "RETURN_TO_MANAGER", result: "CANCELLED" });
  };

  if (mission.stage !== "FILL_FORM") return null;

  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;
  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/0 flex justify-center items-center z-[1000] p-4 pl-33">
      {/* Container resized: max-w-3xl -> max-w-2xl, and reduced vertical margins */}
      <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full my-2 max-h-[55vh] flex flex-col overflow-hidden">
        {/* Header: Reduced padding py-6 -> py-4 */}
        <div className="bg-blue-600 text-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-l font-semibold leading-tight">
                Guardians Registration Portal
              </h1>
              <p className="text-blue-100 text-[10px]">
                Ministry of Digital Services
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-1.5 flex-shrink-0">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Form Content: py-6 -> py-5, space-y-5 -> space-y-4 */}
        <div className="px-6 py-5 overflow-y-auto flex-grow">
          <div className="mb-4 border-l-4 border-blue-600 pl-3">
            <h2 className="text-sm font-semibold text-gray-800">
              {currentSectionData.title}
            </h2>
            <p className="text-gray-600 text-[10px] mt-0.5">
              {currentSectionData.description}
            </p>
          </div>

          <div className="space-y-4">
            {currentSectionData.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-[11px] font-semibold text-black-700 mb-1">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors[field.id] ? "border-red-500" : "border-gray-300"}`}
                  >
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option || "-- Select --"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors[field.id] ? "border-red-500" : "border-gray-300"}`}
                  />
                )}
                {field.helpText && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    ℹ️ {field.helpText}
                  </p>
                )}
                {errors[field.id] && (
                  <p className="text-[10px] text-red-600 mt-1 font-medium">
                    ⚠️ {errors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer: py-5 -> py-4 */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex-shrink-0">
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-100 rounded">
            <p className="text-[10px] text-gray-700 leading-tight">
              <span className="text-yellow-600 font-bold">⚠️</span>{" "}
              <strong>Important:</strong> This portal will never ask for
              sensitive data like passwords or PINs.
            </p>
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-2">
              {currentSection > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  Back
                </button>
              )}
              {!isLastSection ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 shadow-sm"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-[10px] text-gray-400 text-center">
            Section {currentSection + 1} of {sections.length}
          </p>
        </div>
      </div>
    </div>
  );
}
