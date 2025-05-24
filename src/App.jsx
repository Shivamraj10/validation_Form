import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';

const countries = {
  India: ['Delhi', 'Mumbai', 'Bangalore'],
  USA: ['New York', 'San Francisco', 'Los Angeles'],
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+\d{1,3}\d{10}$/.test(phone);
const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);

function Form() {
  const initialFormData = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    showPassword: false,
    phone: '',
    country: '',
    city: '',
    pan: '',
    aadhar: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const validate = (data) => {
    const newErrors = {};
    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.username.trim()) newErrors.username = 'Username is required';
    if (!validateEmail(data.email)) newErrors.email = 'Invalid email';
    if (!data.password) newErrors.password = 'Password is required';
    if (!validatePhone(data.phone)) newErrors.phone = 'Invalid phone number';
    if (!data.country) newErrors.country = 'Country is required';
    if (!data.city) newErrors.city = 'City is required';
    if (!validatePan(data.pan)) newErrors.pan = 'Invalid PAN';
    if (!validateAadhar(data.aadhar)) newErrors.aadhar = 'Invalid Aadhar';
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedForm = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(updatedForm);
    validate(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/success', { state: formData });
      setFormData(initialFormData); // reset form after navigation
    }
  };

  const renderInput = (field, label) => (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}:</label>
      <input
        type={field === 'password' && !formData.showPassword ? 'password' : 'text'}
        name={field}
        value={formData[field]}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-blue-400"
      />
      {field === 'password' && (
        <label className="inline-flex items-center mt-1 text-sm">
          <input
            type="checkbox"
            name="showPassword"
            checked={formData.showPassword}
            onChange={handleChange}
            className="mr-2"
          />
          Show Password
        </label>
      )}
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Registration Form
        </h2>

        {renderInput('firstName', 'First Name')}
        {renderInput('lastName', 'Last Name')}
        {renderInput('username', 'Username')}
        {renderInput('email', 'Email')}
        {renderInput('password', 'Password')}
        {renderInput('phone', 'Phone (+CountryCodeNumber)')}
        {renderInput('pan', 'PAN Number')}
        {renderInput('aadhar', 'Aadhar Number')}

        {/* Country dropdown */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Country:</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-blue-400"
          >
            <option value="">Select Country</option>
            {Object.keys(countries).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* City dropdown */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">City:</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-blue-400"
          >
            <option value="">Select City</option>
            {(countries[formData.country] || []).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 text-white font-semibold rounded transition ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

function Success() {
  const location = useLocation();
  const data = location.state || {};
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Form Submitted Successfully!
        </h2>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}
