import React, { useEffect, useState, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import StoreContext from "../../../Store";

import Loader from "../../../utilities/Loader";

import { GiCricketBat, GiStopwatch } from "react-icons/gi";

const MarketList = (props) => {
  const store = useContext(StoreContext);
  let { eventid, eventtype } = useParams();

  //let type = "";
  //let { type } = (localStorage.getItem("event_data")) ? JSON.parse(localStorage.getItem("event_data")) : "";
  const [loading, setLoading] = useState(false);
  const [eventList, setList] = useState([]);
  const [mkIds, setMkIds] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [expEvent, setExpEvent] = useState([]);
  const [players, setPlayers] = useState([]);

  let k = 0;
  useEffect(() => {
    getEvents();
    getMarkets();
    getPlayers();
  }, []);

  const getEvents = async (e) => {
    setLoading(true);

    // const urlencoded = {
    //   event_id: eventid,
    // };

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + store.getItem("jwt"));

    let requestOptions = {
      method: "POST",
      headers: headers,
      redirect: "follow",
      // body: JSON.stringify(urlencoded),
    };

    fetch(import.meta.env.VITE_API_HOST + "/event/getEvents", requestOptions)
      .then((response) => {
        if (response.status === 403) {
          props.navigate(`/login`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.data) setList(result.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMarkets = async (e) => {
    setLoading(true);

    // const urlencoded = {
    //   event_id: eventid,
    // };

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + store.getItem("jwt"));

    let requestOptions = {
      method: "POST",
      headers: headers,
      redirect: "follow",
      // body: JSON.stringify(urlencoded),
    };

    fetch(
      import.meta.env.VITE_API_HOST + "/event/getMyMarkets",
      requestOptions
    )
      .then((response) => {
        if (response.status === 403) {
          props.navigate(`/login`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.data) {
          setMarkets(result.data);
          setExpEvent(result.expMarket);
          setMkIds([...mkIds, ...result.mkIds]);
          console.log(result.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getPlayers = async (e) => {
    setLoading(true);

    // const urlencoded = {
    //   event_id: eventid,
    // };

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + store.getItem("jwt"));

    let requestOptions = {
      method: "POST",
      headers: headers,
      redirect: "follow",
      // body: JSON.stringify(urlencoded),
    };

    fetch(
      import.meta.env.VITE_API_HOST + "/event/getMyPlayers",
      requestOptions
    )
      .then((response) => {
        if (response.status === 403) {
          props.navigate(`/login`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.data) setPlayers(result.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRuns = async (e) => {
    setLoading(true);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + store.getItem("jwt"));
    const urlencoded = {
      event_id: eventid,
      eventtype: eventtype,
      result_type: "RUN",
    };

    let requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(urlencoded),
    };

    fetch(import.meta.env.VITE_API_HOST + "/result/getResults", requestOptions)
      .then((response) => {
        if (response.status === 403) {
          props.navigate(`/login`);
        } else {
          return response.json();
        }
      })
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //console.log(markets);
  if (loading) return <Loader></Loader>;

  return (
    <>
      <div className="row" key="markets">
        {eventList &&
          eventList.map((v, k) => (
            <div className="col-12 col-md-4 p-0" key={k}>
              <div className="card" key={k}>
                <div className="card-header text-center">
                  <GiCricketBat className="w-6 text-dark"></GiCricketBat>
                  <span className="title-e badge badge-warning text-center">
                    {v.event_name}
                  </span>
                </div>
                <div className="card-body p-2" key={k}>
                  <div className="card-title">
                    <span className="float text-danger badge badge-pill badge-warning">
                      Exp: {expEvent[v.event_id] ? expEvent[v.event_id] : 0}
                    </span>
                  </div>

                  <div className="container" key={k}>
                    <div className="row" key={k}>
                      <ul class="list-group">
                        {markets.length != 0 &&
                          markets.map(
                            (v1, k1) =>
                              v1.event_id == v.event_id && (
                                <li
                                  className="list-group-item list-group-item-dark"
                                  key={k1}
                                >
                                  <span className="float-left title-m badge badge-dark text-center mb-2">
                                    {v1.market_name}
                                  </span>

                                  <table className="table table-bordered table-striped table-sm report-table">
                                    <thead className="thead-light">
                                      <tr>
                                        {/* <th scope="row">Sr.</th> */}
                                        <th>Player</th>
                                        <th>Run</th>
                                        <th>Type</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {players.map(
                                        (v2, k2) =>
                                          v2.market_id == v1.market_id && (
                                            <tr key={k2}>
                                              {/* <td>{i + 1}</td> */}
                                              <td
                                                className={
                                                  v2.type == "user"
                                                    ? "text-success bold"
                                                    : "text-secondary"
                                                }
                                              >
                                                {v2.runner_name}
                                              </td>
                                              <td
                                                className={
                                                  v2.type == "user"
                                                    ? "text-success italic"
                                                    : "text-secondary"
                                                }
                                              >
                                                {v2.runs ? v2.runs : "-"}
                                              </td>
                                              <td
                                                className={
                                                  v2.type == "user"
                                                    ? "text-success bold"
                                                    : "text-secondary"
                                                }
                                              >
                                                {v2.type == "user" ? "U" : "S"}
                                              </td>
                                            </tr>
                                          )
                                      )}
                                    </tbody>
                                  </table>
                                </li>
                              )
                          )}
                        {markets.length === 0 && (
                          <li class="list-group-item list-group-item-dark">
                            No Player Selected yet.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default MarketList;
