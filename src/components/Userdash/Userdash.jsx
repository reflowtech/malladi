import "./Userdash.css";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import mqtt from "mqtt";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Userdash = () => {
  document.title = "Dashboard | ReFlow";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const [message, setMessage] = useState(null);
  const [allTopics, setAllTopics] = useState({});
  const username = import.meta.env.VITE_MQTT_USERNAME;
  const password = import.meta.env.VITE_MQTT_PASSWORD;
  const topic = "AX3/01/#";

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
              <p style={{ textAlign: "left", width: "100%" }}>
                Hello, <strong>{Cookies.get("name")}</strong>{" "}
              </p>
              <p style={{ textAlign: "left", width: "100%" }}>
                <strong>Updated At: </strong>
               {allTopics["AX3/01/MALLADI/UPDATE_TIME"] || "Loading..."}
              </p>

              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"R-408" || "LOADING..."}</td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/01/MALLADI/1/CALIBRATED_VALUE"]
                      ).toPrecision(5)}
                    </td>
                    <td
                      rowSpan={3}
                      style={{
                        background:
                          allTopics["AX3/01/MALLADI/STATUS"] === "Online" ? "green" : "rgb(245,106,94)",
                        color: "white",
                      }}
                    >
                      {allTopics["AX3/01/MALLADI/STATUS"] || "Loading..."}
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
                    <td>{"R-404" || "LOADING..."}</td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/01/MALLADI/2/CALIBRATED_VALUE"]
                      ).toPrecision(4)}
                    </td>
                  </tr>

                  <tr>
                    <td>{"R-403" || "LOADING..."}</td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/01/MALLADI/3/CALIBRATED_VALUE"]
                      ).toPrecision(4)}
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

export default Userdash;
