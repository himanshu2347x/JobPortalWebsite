import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { logout } from "../store/slices/userSlice.js";
import { toast } from "react-toastify";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, message } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      if (isAuthenticated) {
        await dispatch(logout()).unwrap();
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className={show ? "navbar show_navbar" : "navbar"}>
      <div className="logo">
        <img src="/logo.png" alt="logo" />
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/" onClick={() => setShow(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/jobs" onClick={() => setShow(false)}>
              JOBS
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" onClick={() => setShow(false)}>
                  DASHBOARD
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onClick={() => {
                    setShow(false);
                    logoutHandler();
                  }}
                >
                  LOGOUT
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setShow(false)}>
                LOGIN
              </Link>
            </li>
          )}
        </ul>
      </div>
      <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
    </nav>
  );
};

export default Navbar;
