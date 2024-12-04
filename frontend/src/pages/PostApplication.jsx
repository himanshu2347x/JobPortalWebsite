import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearAllErrors,
  postApplication,
  resetApplicationSlice,
  fetchJobSeekerApplications,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import { fetchSingleJob } from "../store/slices/jobSlice";
import { IoMdCash } from "react-icons/io";
import { FaToolbox } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const PostApplication = () => {
  const { singleJob } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading, error, message, applications } = useSelector(
    (state) => state.applications
  );
  const { jobId } = useParams();

  // Local State for Form Fields
  const [hasApplied, setHasApplied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  // Handle Post Application
  const handlePostApplication = (e) => {
    e.preventDefault();

    // Validation check
    if (!name || !email || !phone || !address || !coverLetter) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    if (resume) {
      formData.append("resume", resume);
    }

    dispatch(postApplication({ formData, jobId }));
    
  };

  // Fetch Job Seeker Applications on Authentication Change
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchJobSeekerApplications());
    }
  }, [dispatch, isAuthenticated]);

  // Check if Already Applied
  useEffect(() => {
    if (applications && applications.length > 0) {
      const hasAlreadyApplied = applications.some(
        (application) => application.jobInfo.jobId === jobId
      );
      setHasApplied(hasAlreadyApplied);
    }
  }, [applications, jobId]);

  // Set User Information and Handle Errors/Success Messages
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      setHasApplied(true);
    }

    dispatch(fetchSingleJob(jobId));
  }, [dispatch, error, message, jobId, user]);

  // Job Description and Qualifications Handling
  let qualifications = [];
  let responsibilities = [];
  let offering = [];

  if (singleJob.qualifications) {
    qualifications = singleJob.qualifications.split(". ");
  }
  if (singleJob.responsibilities) {
    responsibilities = singleJob.responsibilities.split(". ");
  }
  if (singleJob.offers) {
    offering = singleJob.offers.split(". ");
  }

  // Handle Resume File Upload
  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  return (
    <>
      <article className="application_page">
        {/* Application Form */}
        <form onSubmit={handlePostApplication}>
          <h3>Application Form</h3>
          <div>
            <label>Job Title</label>
            <input type="text" placeholder={singleJob.title} disabled />
          </div>
          <div>
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Show Cover Letter and Resume for Job Seeker */}
          {user && user.role === "Job Seeker" && (
            <>
              <div>
                <label>Coverletter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={10}
                />
              </div>
              <div>
                <label>Resume</label>
                <input type="file" onChange={resumeHandler} />
              </div>
            </>
          )}

          {/* Submit Button */}
          {isAuthenticated && user.role === "Job Seeker" && (
            <div style={{ alignItems: "flex-end" }}>
              <button
                className="btn"
                type="submit"
                disabled={loading || hasApplied}
              >
                {hasApplied ? "Already Applied" : "Apply"}
              </button>
            </div>
          )}
        </form>

        {/* Job Details */}
        <div className="job-details">
          <header>
            <h3>{singleJob.title}</h3>
            {singleJob.personalWebsite && (
              <Link target="_blank" to={singleJob.personalWebsite.url}>
                {singleJob.personalWebsite.title}
              </Link>
            )}
            <p>{singleJob.location}</p>
            <p>Rs. {singleJob.salary} a month</p>
          </header>
          <hr />

          <section>
            {/* Job Pay and Type */}
            <div className="wrapper">
              <h3>Job details</h3>
              <div>
                <IoMdCash />
                <div>
                  <span>Pay</span>
                  <span>{singleJob.salary} a month</span>
                </div>
              </div>
              <div>
                <FaToolbox />
                <div>
                  <span>Job type</span>
                  <span>{singleJob.jobType}</span>
                </div>
              </div>
            </div>

            <hr />

            {/* Location */}
            <div className="wrapper">
              <h3>Location</h3>
              <div className="location-wrapper">
                <FaLocationDot />
                <span>{singleJob.location}</span>
              </div>
            </div>

            <hr />

            {/* Job Description */}
            <div className="wrapper">
              <h3>Full Job Description</h3>
              <p>{singleJob.introduction}</p>

              {singleJob.qualifications && (
                <div>
                  <h4>Qualifications</h4>
                  <ul>
                    {qualifications.map((element) => (
                      <li key={element} style={{ listStyle: "inside" }}>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {singleJob.responsibilities && (
                <div>
                  <h4>Responsibilities</h4>
                  <ul>
                    {responsibilities.map((element) => (
                      <li key={element} style={{ listStyle: "inside" }}>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {singleJob.offers && (
                <div>
                  <h4>Offering</h4>
                  <ul>
                    {offering.map((element) => (
                      <li key={element} style={{ listStyle: "inside" }}>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
          <hr />

          {/* Job Niche */}
          <footer>
            <h3>Job Niche</h3>
            <p>{singleJob.jobNiche}</p>
          </footer>
        </div>
      </article>
    </>
  );
};

export default PostApplication;
