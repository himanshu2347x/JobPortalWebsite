import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  resetUpdateState,
  updateProfile,
  getUser,
} from "../store/slices/userSlice";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { user, loading, error, isUpdated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // Initialize states with fallback to empty strings
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");

  // Populate state when user data is available
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");
      setFirstNiche(user.niches?.firstNiche || "");
      setSecondNiche(user.niches?.secondNiche || "");
      setThirdNiche(user.niches?.thirdNiche || "");
      setResumePreview(user.resume?.url || "");
    }
  }, [user]);

  // Handle form submission
  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    if (user?.role === "Job Seeker") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
    }
    if (resume) {
      formData.append("resume", resume);
    }
    dispatch(updateProfile(formData));
  };

  // Toast notifications and reset state after update
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUpdateState());
    }
    if (isUpdated) {
      toast.success("Profile Updated.");
      dispatch(getUser());
      dispatch(resetUpdateState());
    }
  }, [error, isUpdated, dispatch, navigateTo]);


  // Handle file input with validation
  const resumeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setResumePreview(reader.result);
        setResume(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  return (
    <div className="account_components">
      <h3>Update Profile</h3>
      {/* Profile Fields */}
      <div>
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {/* Job Seeker Fields */}
      {user?.role === "Job Seeker" && (
        <>
          <div>
            <label>My Preferred Job Niches</label>
            <select
              value={firstNiche}
              onChange={(e) => setFirstNiche(e.target.value)}
            >
              {nichesArray.map((element, index) => (
                <option value={element} key={index}>
                  {element}
                </option>
              ))}
            </select>
          </div>
          {/* Similar code for other niche selects */}
          <div>
            <label>Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <label>Upload Resume</label>
            <input type="file" onChange={resumeHandler} />
            {resumePreview && (
              <Link to={resumePreview} target="_blank">
                View Current Resume
              </Link>
            )}
          </div>
        </>
      )}
      <button onClick={handleUpdateProfile} disabled={loading}>
        Save Changes
      </button>
    </div>
  );
};

export default UpdateProfile;
