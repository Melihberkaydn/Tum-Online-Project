import ClassSection from "../components/Class Section/ClassSection";
import styles from "./Classes.module.css";
import {
  fetchAvailableClasses,
  fetchUserClasses,
  updateUserClasses,
} from "../http";
import { useState, useEffect, useRef, useCallback } from "react";
import Modal from "../components/Modal/Modal";
import DeleteConfirmation from "../components/Delete Confirmation/DeleteConfirmation";

export default function Classes() {
  const selectedClassRef = useRef();
  const [isFetchingAllClasses, setIsFetchingAllClasses] = useState(false);
  const [isFetchingUserClasses, setIsFetchingUserClasses] = useState(false);
  const [availableClasses, setavailableClasses] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [error, setError] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingClasses, setErrorUpdatingClasses] = useState();

  useEffect(() => {
    async function fetchClasses() {
      setIsFetchingAllClasses(true);

      try {
        const classes = await fetchAvailableClasses();
        setavailableClasses(classes);
        setIsFetchingAllClasses(false);
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch classes, please try again later.",
        });
        setIsFetchingAllClasses(false);
      }
    }

    fetchClasses();
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

  async function handleSelectClass(selectedClass) {
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
      await updateUserClasses([selectedClass, ...userClasses]);
    } catch (error) {
      setUserClasses(userClasses);
      setErrorUpdatingClasses({
        message: error.message || "Failed to update classes.",
      });
    }
  }

  function handleStartRemoveClass(selectedClass) {
    setModalIsOpen(true);
    selectedClassRef.current = selectedClass;
  }

  function handleStopRemoveClass() {
    setModalIsOpen(false);
  }

  const handleRemoveClass = useCallback(
    async function handleRemoveClass() {
      setUserClasses((prevUserClasses) =>
        prevUserClasses.filter(
          (userClass) => userClass.id !== selectedClassRef.current.id
        )
      );

      try {
        await updateUserClasses(
          userClasses.filter(
            (userClass) => userClass.id !== selectedClassRef.current.id
          )
        );
      } catch (error) {
        setUserClasses(userClasses);
        setErrorUpdatingClasses({
          message: error.message || "Failed to delete class.",
        });
      }

      setModalIsOpen(false);
    },
    [userClasses]
  );

  function handleError() {
    setErrorUpdatingClasses(null);
  }

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <section className={styles.classCategory}>
      <Modal open={errorUpdatingClasses} onClose={handleError}>
        {errorUpdatingClasses && (
          <Error
            title="An error occurred!"
            message={errorUpdatingClasses.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemoveClass}>
        <DeleteConfirmation
          onCancel={handleStopRemoveClass}
          onConfirm={handleRemoveClass}
        />
      </Modal>
      <ClassSection
        title="My Classes"
        classes={userClasses}
        fallbackText="No class is found"
        onSelectClass={handleStartRemoveClass}
        isLoading={isFetchingUserClasses}
        loadingText="Classes are loading"
      />
      <ClassSection
        title="All Classes"
        classes={availableClasses}
        fallbackText="No class is found"
        onSelectClass={handleSelectClass}
        isLoading={isFetchingAllClasses}
        loadingText="Classes are loading"
      />
    </section>
  );
}
