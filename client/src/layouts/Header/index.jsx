import { IconButton } from "@mui/material";
import {
  Search,
  AccountCircle,
  Menu,
  LanguageRounded,
} from "@mui/icons-material";
import variables from "../../assets/styles/variables.module.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../assets/styles/navbar.module.scss";
import { Link } from "react-router-dom";
import { setLogout } from "../../redux/state";

const Header = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return (
    <>
      <div className={styles["navbar"]}>
        <a href="/">
          <img src="/images/airbnb-logo.png" alt="logo" />
        </a>

        <div className={styles["navbar_search"]}>
          <input type="text" placeholder="Search ..." />
          <IconButton>
            <Search sx={{ color: variables.pinkred }} />
          </IconButton>
        </div>

        <div className={styles["navbar_right"]}>
          {user ? (
            <a href="/create-listing" className="host">
              Become a Host
            </a>
          ) : (
            <a href="/login" className="host">
              Become a Host
            </a>
          )}
          <LanguageRounded sx={{ color: variables.darkgrey }} />
          <button
            className={styles["navbar_right_account"]}
            onClick={() => setDropdownMenu(!dropdownMenu)}
          >
            <Menu sx={{ color: variables.darkgrey }} />
            {!user ? (
              <AccountCircle sx={{ color: variables.darkgrey }} />
            ) : (
              <img
                src={user.profileImagePath}
                alt="profile photo"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            )}
          </button>

          {dropdownMenu && !user && (
            <div className={styles["navbar_right_accountmenu"]}>
              <Link to="/login">Log In</Link>
              <Link to="/register">Sign Up</Link>
            </div>
          )}

          {dropdownMenu && user && (
            <div className={styles["navbar_right_accountmenu"]}>
              <Link to={`/${user._id}/trips`}>Trip List</Link>
              <Link to={`/${user._id}/wishList`}>Wish List</Link>
              <Link to={`/${user._id}/properties`}>Property List</Link>
              <Link to={`/${user._id}/reservations`}>Reservation List</Link>
              <Link to="/create-listing">Become a Host</Link>

              <Link
                to="/login"
                onClick={() => {
                  dispatch(setLogout());
                }}
              >
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
