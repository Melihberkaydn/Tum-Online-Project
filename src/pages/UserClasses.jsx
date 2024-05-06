import ClassSection from "../components/Class Section/ClassSection";
import styles from "./Classes.module.css";
import { addUserClass } from "../http";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLoaderData, json } from "react-router-dom";
import ErrorPage from "./Error";
import { getAuthToken } from "../util/auth";

export default function UserClasses() {
  const selectedClassRef = useRef();
  const [isFetchingAllClasses, setIsFetchingAllClasses] = useState(false);
  //const [isFetchingUserClasses, setIsFetchingUserClasses] = useState(false);
  const [availableClasses, setavailableClasses] = useState([]);
  const [error, setError] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingClasses, setErrorUpdatingClasses] = useState();
  const userClasses = useLoaderData();

  async function handleSelectClass(classId) {
    console.log("handle select class");
    try {
      console.log(classId);
      await addUserClass(classId);
    } catch (error) {
      //setUserClasses(userClasses);
      setErrorUpdatingClasses({
        message: error.message || "Failed to update classes.",
      });
    }
  }

  if (error) {
    return <ErrorPage title="An error occurred!" message={error.message} />;
  }

  return (
    <section className={styles.classCategory}>
      <ClassSection
        title="Enrolled Classes"
        givenClasses={userClasses}
        fallbackText="No class is found"
        onSelectClass={handleSelectClass}
        isLoading={isFetchingAllClasses}
        loadingText="Classes are loading"
      />
    </section>
  );
}

export async function loader() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/enrolled-classes", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw json(
      { message: "Could not fetch events." },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData;
  }
}
