import ClassSection from "../components/Class Section/ClassSection";
import styles from "./Classes.module.css";
import { fetchAvailableClasses, fetchUserClasses } from "../http";
import { useState, useEffect } from "react";

export default function Classes() {
  const selectedPlace = useRef();
  const [isFetchingAllClasses, setIsFetchingAllClasses] = useState(false);
  const [isFetchingUserClasses, setIsFetchingUserClasses] = useState(false);
  const [availableClasses, setavailableClasses] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [error, setError] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetchingAllClasses(true);

      try {
        const places = await fetchAvailableClasses();
        setavailableClasses(places);
        setIsFetchingAllClasses(false);
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch classes, please try again later.",
        });
        setIsFetchingAllClasses(false);
      }
    }

    fetchPlaces();
  }, []);

  useEffect(() => {
    async function fetchClasses() {
      setIsFetchingUserClasses(true);
      try {
        const userClasses = await fetchUserClasses();
        setUserClasses(userClasses);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch user classes." });
      }

      setIsFetchingUserClasses(false);
    }

    fetchClasses();
  }, []);

  async function handleSelectPlace(selectedClass) {
    // await updateUserPlaces([selectedPlace, ...userPlaces]);

    setUserClasses((prevPickedClasses) => {
      if (!prevPickedClasses) {
        prevPickedClasses = [];
      }
      if (
        prevPickedClasses.some((lecture) => lecture.id === selectedClass.id)
      ) {
        return prevPickedClasses;
      }
      return [selectedClass, ...prevPickedClasses];
    });

    try {
      await updateUserPlaces([selectedClass, ...userClasses]);
    } catch (error) {
      setUserClasses(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places.",
      });
    }
  }

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <section className={styles.placesCategory}>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <ClassSection
        title="User Classes"
        classes={availableClasses}
        fallbackText="No class is found"
        onSelectPlace={console.log}
        isLoading={isFetchingUserClasses}
        loadingText="Classes are loading"
      />
      <ClassSection
        title="All Classes"
        classes={availableClasses}
        fallbackText="No class is found"
        onSelectPlace={console.log}
        isLoading={isFetchingAllClasses}
        loadingText="Classes are loading"
      />
    </section>
  );
}
