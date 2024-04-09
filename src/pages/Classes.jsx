import ClassSection from "../components/Class Section/ClassSection";
import styles from "./Classes.module.css";
import { fetchAvailableClasses } from "../http";
import { useState, useEffect } from "react";

export default function Classes() {
  const [isFetching, setIsFetching] = useState(false);
  const [availableClasses, setavailableClasses] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailableClasses();
        setavailableClasses(places);
        setIsFetching(false);
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <section className={styles.placesCategory}>
      <ClassSection
        title="All Classes"
        classes={availableClasses}
        fallbackText="No class is found"
        onSelectPlace={console.log}
        isLoading={isFetching}
        loadingText="Classes are loading"
      />
    </section>
  );
}
