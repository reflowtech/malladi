import React, {  useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import Registerbox from "../components/Registerbox/Registerbox";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, set } from "firebase/database";

import { useCookies } from 'react-cookie';


const Registerpage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);


  const[renderPage,setRenderPage] = useState(false)
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const fetchuser = async () => {
      const uid = Cookies.get("uid");
      if(uid === undefined){
        navigate("/");
      }
      else{
        console.log(uid);
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data.userType != "admin") {
            navigate("/");
          }
          else{
            setRenderPage(true)
          }
        });
      }
    };
    fetchuser();
  }, []);

  return (
    <>
    <div className="main-box">

      {
        renderPage? <Registerbox /> : null
      }
      </div>
    </>
  );
};

export default Registerpage;
