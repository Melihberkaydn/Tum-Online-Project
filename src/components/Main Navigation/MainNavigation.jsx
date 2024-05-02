import { NavLink } from "react-router-dom";
import logoImg from "../../assets/LogoTUM.png";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logoContainer}>
        <img src={logoImg} alt="TUM Logo" />
        <h1>Online</h1>
      </div>

      <p>
        Welcome to campus management system of Technical University of Munich:
        Tum Online!
      </p>
      <nav className={classes.navItem}>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/All-classes"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              All Classes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/enrolled-classes"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Enrolled Classes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
