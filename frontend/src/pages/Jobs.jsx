import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllErrors, fetchJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const jobRef = useRef(null);
  const navigate = useNavigate();
  const { jobs, loading, error, message } = useSelector((state) => state.jobs);
  const { isAuthenticated} = useSelector(
    (state) => state.user
  );

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  };
  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
    }
    if (message) {
       toast.success(message);
       dispatch(clearAllErrors());
     }
    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche,message]); 

  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Ahmedabad",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kochi",
    "Surat",
    "Chandigarh",
    "Indore",
    "Patna",
    "Bhopal",
    "Visakhapatnam",
    "Nagpur",
    "Vijayawada",
    "Agra",
  ];

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
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch}>Find Job</button>
            <FaSearch />
          </div>
          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job By City</h2>
                {cities.map((city, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={city}
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => handleCityChange(city)}
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </div>
              <div className="cities">
                <h2>Filter Job By Niche</h2>
                {nichesArray.map((niche, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={niche}
                      name="niche"
                      value={niche}
                      checked={selectedNiche === niche}
                      onChange={() => handleNicheChange(niche)}
                    />
                    <label htmlFor={niche}>{niche}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Filter By City</option>
                  {cities.map((city, index) => (
                    <option value={city} key={index}>
                      {city}
                    </option>
                  ))}
                </select>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                >
                  <option value="">Filter By Niche</option>
                  {nichesArray.map((niche, index) => (
                    <option value={niche} key={index}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>
              <div className="jobs_container">
                {jobs &&
                  jobs
                    .filter((item) =>
                      item.title
                        .toLowerCase()
                        .includes(searchKeyword.toLowerCase())
                    )
                    .map((element) => {
                      return (
                        <div className="card" key={element._id}>
                          {element.hiringMultipleCandidates === "Yes" ? (
                            <p className="hiring-multiple">
                              Hiring Multiple Candidates
                            </p>
                          ) : (
                            <p className="hiring">Hiring</p>
                          )}
                          <p className="title">{element.title}</p>
                          <p className="company">{element.companyName}</p>
                          <p className="location">{element.location}</p>
                          <p className="salary">
                            <span>Salary:</span> Rs. {element.salary}
                          </p>
                          <p className="posted">
                            <span>Posted On:</span>{" "}
                            {element.jobPostedOn.substring(0, 10)}
                          </p>
                          <div className="btn-wrapper">
                            <Link
                              className="btn"
                              to={
                                isAuthenticated
                                  ? `/post/application/${element._id}`
                                  : "/login"
                              }
                            >
                              Apply Now
                            </Link>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
