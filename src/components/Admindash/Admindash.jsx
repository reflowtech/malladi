import "./Admindash.css";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import mqtt from "mqtt";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Admindash = () => {
  document.title = "Dashboard | ReFlow";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const [message, setMessage] = useState(null);
  const [allTopics, setAllTopics] = useState({});
  const username = import.meta.env.VITE_MQTT_USERNAME;
  const password = import.meta.env.VITE_MQTT_PASSWORD;
  const topic = "MALLADI/AX301/#";

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
    const brokerUrl = "ws://reflow.online:9001";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic);
    });

    // Initialize an object to store all topics and messages
    const allaTopics = {};

    client.on("message", (receivedTopic, receivedMessage) => {
      try {
        // Try to parse the incoming message as JSON
        const parsedMessage = JSON.parse(receivedMessage.toString());

        // Update the object with the latest message for the specific topic
        allaTopics[receivedTopic] = parsedMessage;
        setLoading(false);
        setAllTopics((prevAllTopics) => ({
          ...prevAllTopics,
          [receivedTopic]: parsedMessage,
        }));
        console.log(allTopics);
      } catch (error) {}
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic]);

  return (
    <>
      {loading ? (
        <div className="loader">
          <h1>Loading...!</h1>
        </div>
      ) : (
        <>
          <section className="main">
            <>
              <div className="dashintro">
                <p style={{ textAlign: "left", width: "100%" }}>
                  Hello ADMIN ,{" "}
                  <strong>{Cookies.get("name")}</strong>{" "}
                </p>
                <Link to="/register">Add User</Link>
              </div>

              <table>
                <thead>
                    
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th colSpan={2}>Range</th>
                    <th rowSpan={2}>Calibration</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Calibrated Readings</th>
                    <th rowSpan={2}>Temperature Level</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                  <tr>
                    <th>Min</th>
                    <th>Max</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                  <td><input type="text" value={"R-408" || "LOADING.."} /></td>
                  <td><input type="text" value={allTopics["MALLADI/AX301/1/MIN"] || "LOADING.."} /></td>
                  <td><input type="text" value={allTopics["MALLADI/AX301/1/MAX"] || "LOADING.."} /></td>
                  <td><input type="text" value={parseFloat(allTopics["MALLADI/AX301/1/CALIBRATION"]).toFixed(2) ||
                        "LOADING...."} /></td>
                    <td>
                      {parseFloat(allTopics["MALLADI/AX301/1/OP"]).toPrecision(
                        4
                      ) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics["MALLADI/AX301/1/CALIBRATION_READ"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["MALLADI/AX301/1/OP"]) || 0}
                        min={allTopics["MALLADI/AX301/1/MIN"]}
                        max={allTopics["MALLADI/AX301/1/MAX"]}
                      ></meter>
                    </td>
                    <td
                      rowSpan={3}
                      style={{
                        background:
                          "Online" === "Online" ? "green" : "rgb(245,106,94)",
                        color: "white",
                      }}
                    >
                      Online
                    </td>
                    <td
                      rowSpan={3}
                      style={{
                        background: "white",
                      }}
                    >
                      <Link
                        className="btn-export"
                        to={`https://malladi.s3.amazonaws.com/AX301.csv`}
                        target="_blank"
                        download
                      >
                        EXPORT
                      </Link>
                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={"R-404" || "LOADING.."} /></td>
                  <td><input type="text" value={allTopics["MALLADI/AX301/2/MIN"] || "LOADING.."} /></td>
                  <td><input type="text" value={allTopics["MALLADI/AX301/2/MAX"] || "LOADING.."} /></td>
                  <td><input type="text" value={parseFloat(allTopics["MALLADI/AX301/2/CALIBRATION"]).toFixed(2) ||
                        "LOADING...."} /></td>
                    <td>
                      {parseFloat(allTopics["MALLADI/AX301/2/OP"]).toPrecision(
                        4
                      ) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics["MALLADI/AX301/2/CALIBRATION_READ"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["MALLADI/AX301/2/OP"]) || 0}
                        min={allTopics["MALLADI/AX301/2/MIN"]}
                        max={allTopics["MALLADI/AX301/2/MAX"]}
                      ></meter>
                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={"R-403" || "LOADING.."} /></td>
                  <td><input type="text" value={allTopics["MALLADI/AX301/3/MIN"] || "LOADING.."} /></td>
                  <td><input type="text" value={allTopics["MALLADI/AX301/3/MAX"] || "LOADING.."} /></td>
                  <td><input type="text" value={parseFloat(allTopics["MALLADI/AX301/3/CALIBRATION"]).toFixed(2) || "LOADING...."} /></td>
                    <td>
                      {parseFloat(allTopics["MALLADI/AX301/3/OP"]).toPrecision(
                        4
                      )  || "LOADING...."} &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics["MALLADI/AX301/3/CALIBRATION_READ"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["MALLADI/AX301/3/OP"]) || 0}
                        min={allTopics["MALLADI/AX301/3/MIN"]}
                        max={allTopics["MALLADI/AX301/3/MAX"]}
                      ></meter>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          </section>
        </>
      )}
    </>
  );
};

export default Admindash;
