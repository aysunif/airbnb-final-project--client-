import { IconButton } from "@mui/material";
import {
  Search,
  AccountCircle,
  Menu,
} from "@mui/icons-material";
import variables from "../../assets/styles/variables.module.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../assets/styles/navbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../../redux/state";
import Cookies from "js-cookie";

const Header = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  return (
    <>
      <div className={styles["navbar"]}>
        <Link to="/">
          <img src="/images/airbnb-logo.png" alt="logo" />
        </Link>

        <div className={styles["navbar_search"]}>
          <input
            type="text"
            placeholder="Search ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton disabled={search === ""}>
            <Search
              sx={{ color: variables.pinkred }}
              onClick={() => {
                navigate(`/properties/search/${search}`);
              }}
            />
          </IconButton>
        </div>

        <div className={styles["navbar_right"]}>
          {user ? (
            <Link to="/create-listing" className={styles["host"]}>
              Become a Host
            </Link>
          ) : (
            <Link to="/login" className={styles["host"]}>
              Become a Host
            </Link>
          )}

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
              <Link to={`/profile`}>Profile</Link>
              <Link to={`/${user._id}/trips`}>Trip List</Link>
              <Link to={`/${user._id}/wishList`}>Wish List</Link>
              <Link to={`/${user._id}/properties`}>Property List</Link>
              <Link to={`/${user._id}/reservations`}>Reservation List</Link>
              <Link to="/create-listing">Become a Host</Link>

              <Link
                to="/login"
                onClick={() => {
                  Cookies.remove("token");
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
