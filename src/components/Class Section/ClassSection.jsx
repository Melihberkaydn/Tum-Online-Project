import styles from "./ClassSection.module.css";

export default function ClassSection({
  title,
  classes,
  fallbackText,
  onSelectClass,
  isLoading,
  loadingText,
}) {
  return (
    <>
      <h2>{title}</h2>
      {isLoading && <p className={styles["fallback-text"]}>{loadingText}</p>}
      {!isLoading && classes.length === 0 && (
        <p className={styles["fallback-text"]}>{fallbackText}</p>
      )}
      {!isLoading && classes.length > 0 && (
        <ul className={styles.places}>
          {classes.map((place) => (
            <li key={place.id} className={styles["place-item"]}>
              <button onClick={() => onSelectClass(place)}>
                <img
                  src={`http://localhost:3000/${place.image.src}`}
                  alt={place.image.alt}
                />
                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
