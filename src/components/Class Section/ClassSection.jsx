/* eslint-disable react/prop-types */
import styles from "./ClassSection.module.css";

export default function ClassSection({
  title,
  givenClasses,
  fallbackText,
  onSelectClass,
  isLoading,
  loadingText,
}) {

  givenClasses.map((given_class) => console.log(given_class))

  return (
    <>
      <h2 className={styles.header}>{title}</h2>
      {isLoading && <p className={styles["fallback-text"]}>{loadingText}</p>}
      {!isLoading && givenClasses.length === 0 && (
        <p className={styles["fallback-text"]}>{fallbackText}</p>
      )}
      {!isLoading && givenClasses.length > 0 && (
        <ul className={styles.places}>
          {givenClasses.map((given_class) => (
            <li key={given_class.ID} className={styles["place-item"]}>
              <button onClick={() => onSelectClass(given_class)}>
                <img
                  src={given_class.IMAGE_URL}                  
                />
                <h3>{given_class.CLASS_NAME}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
