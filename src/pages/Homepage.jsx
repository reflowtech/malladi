import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Userdash from "../components/Userdash/Userdash";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import Admindash from "../components/Admindash/Admindash";

const Homepage = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCookie = async () => {
    try {
      const user = await Cookies.get("user");
      if (user === undefined) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error while getting the user cookie:", error);
    }
  };
  getCookie();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
        } catch (error) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    });

    // Cleanup function to unsubscribe the observer when the component is unmounted
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchuser = async () => {
      const jwt = await Cookies.get("jwt");
      const uid = await Cookies.get("uid");
      if (jwt === undefined) {
        navigate("/");
      } else {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserType(data.userType);
          setLoading(false);
        });
      }
    };
    fetchuser();
  }, []);

  return (
    <>
      <div className="main-box">
        {userType === "admin" ? <Admindash /> : <Userdash />}
      </div>
    </>
  );
};

export default Homepage;
