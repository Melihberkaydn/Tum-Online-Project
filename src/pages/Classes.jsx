import ClassSection from "../components/ClassSection";
import styles from "./Classes.module.css";
import CLASSES from "../data";

export default function Classes() {
  const classes = CLASSES;

  return (
    <section className={styles.placesCategory}>
      <ClassSection
        title="All Classes"
        classes={classes}
        fallbackText="No class is found"
        onSelectPlace={console.log}
        isLoading={false}
        loadingText="Classes are loading"
      />
    </section>
  );
}
