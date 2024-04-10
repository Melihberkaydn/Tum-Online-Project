import { useEffect } from "react";
import styles from "./DeleteConfirmation.module.css";
import ProgressBar from "./ProgressBar.jsx";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onConfirm();
  //   }, TIMER);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [onConfirm]);

  return (
    <div className={styles.deleteConfirmation}>
      <h2 className={styles.header}>Are you sure?</h2>
      <p className={styles.paragraph}>
        Do you really want to remove this place?
      </p>
      <div className={styles.confirmationActions}>
        <button onClick={onCancel} className={styles.button}>
          No
        </button>
        <button onClick={onConfirm} className={styles.button}>
          Yes
        </button>
      </div>
      {/* <ProgressBar timer={TIMER} /> */}
    </div>
  );
}
