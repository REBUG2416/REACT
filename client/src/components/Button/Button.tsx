import styles from "./Button.module.css";

function Button() {
  //   const styles = {
  //     backgroundColor: "hsl(200, 100%, 50%)",
  //     color: "white",
  //     borderRadius: "10px",
  //     padding: "10px 20px",
  //     cursor: "pointer",
  //     border: "none",
  //   };

  return <button className={styles.btn}>Click Me</button>;
}
export default Button;
