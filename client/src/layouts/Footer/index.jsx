import styles from  "../../assets/styles/footer.module.scss"
import { LocalPhone, Email } from "@mui/icons-material"
const Footer = () => {
  return (
    <>
    <div className={styles["footer"]}>
      <div className={styles["footer_left"]}>
        <a href="/"><img src="/images/airbnb-logo.png" alt="logo" /></a>
      </div>

      <div className={styles["footer_center"]}>
        <h3>Useful Links</h3>
        <ul>
          <li><a href="/">About Us</a></li>
          <li><a href="/">Help Center</a></li>
          <li><a href="/">AirCover</a></li>
        </ul>
      </div>

      <div className={styles["footer_right"]}>
        <h3>Contact</h3>
        <div className={styles["footer_right_info"]}>
          <LocalPhone />
          <p>+1 234 567 890</p>
        </div>
        <div className={styles["footer_right_info"]}>
          <Email />
          <p>airbnb@support.com</p>
        </div>
        {/* <img src="" alt="payment" /> */}
      </div>
    </div>
    </>
  )
}

export default Footer