import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import StoreContext from "../../../Store";
import AddPlayer from "./AddPlayers";
import CreateEvent from "./CreateEvent";
import ResultList from "./ResultList";
//import Result from "./Result";

import {
  EyeIcon,
  LockClosedIcon,
  
} from "@heroicons/react/24/solid";

const defaultDate = () => {
  return `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(
    2,
    0
  )}-${`${new Date().getDate()}`.padStart(
    2,
    0
  )}T${`${new Date().getHours()}`.padStart(
    2,
    0
  )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`;
};

const EventList = (props) => {

  const store = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [eventList, setList] = useState([]);
  const [create, setCreate] = useState(false);

  const [player, setPlayer] = useState(false);
  const [market, setMarket] = useState(false);
  const [resultFlag, setResultFlag] = useState(false);

  //const [id, setId] = useState("");
  const [event_id, setEventId] = useState("");
  const [market_id, setMarketId] = useState("");
  const [event_name, setEventName] = useState("");
  const [event_type, setEventType] = useState("");
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [opendate, setOpenDate] = useState(defaultDate());
  const [closedate, setCloseDate] = useState(defaultDate());

  const [message, setMessage] = useState();
  const [errorClass, setErrorClass] = useState("alert alert-success");

  const closeModal = async (e) => {
    setEventId("");
    setEventName("");
    setTeam1('');
    setTeam2('');
    setCreate(false);
    setPlayer(false);
    setMarket(false);
    setResultFlag(false);
    getEvents();
  };

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async (e) => {
    setLoading(true);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + store.getItem("jwt"));

    let requestOptions = {
      method: "POST",
      headers: headers,
    };

    fetch(import.meta.env.VITE_API_HOST + "/setting/getEventsAll", requestOptions)
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

  const overMatch = async (event_id) => {
    if (!window.confirm("sure to delete this event?")) return;
    const urlencoded = {
      event_id: event_id,
    };
    setLoading(true);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + store.getItem("jwt"));
    let requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(urlencoded),
    };

    fetch(import.meta.env.VITE_API_HOST + "/setting/delEvent", requestOptions)
      .then((response) => {
        if (response.status === 403) {
          props.navigate(`/login`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result) {
          alert("Event Removed");
          getEvents();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editPlayer = async (e) => {
    setEventId(e.event_id);
    setEventName(e.event_name);
    setMarketId(e.market_id);
    setTimeout(() => {
      setPlayer(true);
    }, 5);
  };

  const editEvent = async (e) => {

    // console.log(e)
    // console.log(new Date(e.opendate).toLocaleString("en-US", ""))
    setEventId(e.event_id);
    setEventName(e.event_name);
    setMarketId(e.market_id);
    setTeam1(e.team1);
    setTeam2(e.team2);
    setOpenDate(e.opendate)
    setCloseDate(e.closedate)
    await store.setItem("event_data", e);
    setTimeout(() => {
      setCreate(true);
    }, 5);
  };

  const editMarket = async (e) => {
    setEventId(e.event_id);
    setEventName(e.event_name);
    setEventType(e.type);
    setTimeout(() => {
      setMarket(true);
    }, 5);
  };

  

  const updateEventStatus = async (flag, type, event_id, index) => {
    //if (!window.confirm("sure to change?")) return;
    setLoading(true);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + localStorage.getItem("jwt"));

    const urlencoded = {
      event_id: event_id,
    };

    //console.log(flag)
    
    if (type === "status") {
      urlencoded.status = flag;
    } else if (type === "bet_lock") {
      urlencoded.bet_lock = flag;
    } else if (type === "lock") {
      urlencoded.lock = flag;
    }

    let requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(urlencoded),
    };

    fetch(import.meta.env.VITE_API_HOST + "/setting/updateEventStatus", requestOptions)
      .then((response) => {
        if (response.status === 401) {
          props.navigate(`/login`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.message) {
          let rn = [...eventList];
          if (type === "status") {
            rn[index].status = flag;
          } else if (type === "bet_lock") {
            rn[index].bet_lock = flag;
          }
          setMessage(result.message);
          setErrorClass("alert alert-success");
        }
      })
      .catch((err) => {
        setMessage(err);
        setErrorClass("alert alert-danger");
      })
      .finally(async () => {
        setTimeout(() => {
          setErrorClass("");
          setMessage("");
        }, 3000);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">- : Event List : -</h1>
          <button
            onClick={(e) => {
              setCreate(true);
            }}
            className="btn btn-sm btn-secondary float-right mt-2"
          >
            +
          </button>
        </div>
      </div>
      <div className="table-responsive mt-2">
        <table className="table table-bordered table-striped table-sm report-table">
          <thead>
            <tr>
              <th width="5%" className="text-center px-2 py-0.5">
                Sr.
              </th>
              <th className="px-2 py-1 text-left">Event Id</th>
              <th className="px-2 py-1 text-left">Event Name</th>
              <th className="px-2 py-1 text-left">Start Time</th>
              <th className="px-2 py-1 text-left">End Time</th>
              <th className="px-2 py-1 text-left">Status</th>
              <th className="px-2 py-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {eventList.map((v, k) => (
              <tr
                role="button"
                title={v.event_name}
                className="bg-white dark:bg-sky-300/10 dark:border-blue-500 border-primary-300"
              >
                <td className="text-center px-2 py-1" width="5%">
                  {k + 1}
                </td>
                <td className="px-2 py-0.5">{v.event_id}</td>
                <td className="text-left px-2 py-0.5">
                  <u>
                    <NavLink
                      className="btn btn-sm btn-success ms-1"
                      to="#"
                    >
                      {v.event_name}
                    </NavLink>
                  </u>
                </td>
                <td className="text-left px-2 py-0.5">
                  {new Date(v.opendate).toLocaleString("en-US", "")}
                </td>
                <td className="text-left px-2 py-0.5">
                  {new Date(v.closedate).toLocaleString("en-US", "")}
                </td>
                <td className="text-left px-2 py-0.5">
                  <button
                    title="Event Status"
                    onClick={async () => {
                      await updateEventStatus(
                        v.status === null ? false : !v.status,
                        "status",
                        v.event_id,
                        k
                      );
                    }}
                    className={`btn btn-sm ${
                      v.status === null || Boolean(v.status) === true
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                  >
                    {/* {v.status == 1 ? "Active" : "Inactive"} */}
                    <EyeIcon className="w-6"></EyeIcon>
                  </button>
                </td>
                <td className="text-center text-xs">
                <button
                    title="Event Bet Lock"
                    onClick={async () => {
                      await updateEventStatus(
                        v.bet_lock === null ? false : !v.bet_lock,
                        "bet_lock",
                        v.event_id,
                        k
                      );
                    }}
                    className={`btn btn-sm me-1 ${
                      v.bet_lock === null || Boolean(v.bet_lock) === false
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                  >
                    <LockClosedIcon className="w-6"></LockClosedIcon>
                  </button>

                  <NavLink
                    className="btn btn-sm btn-dark ms-1"
                    title="Other"
                    to={"/result/" + v.event_id + "/" + v.type}
                  >
                    Result
                  </NavLink>
                  {/* <button
                    onClick={(e) => {
                      editMarket(v);
                    }}
                    className="btn btn-sm btn-dark ms-1"
                  >
                    Result
                  </button> */}
                  


                  <NavLink
                    className="btn btn-sm btn-dark ms-1"
                    title="Other"
                    to={"/marketview/" + v.event_id + "/" + v.type}
                  >
                    Markets
                  </NavLink>
                  <button
                    onClick={(e) => {
                      editEvent(v);
                    }}
                    className="btn btn-sm btn-dark ms-1"
                  >
                    Edit
                  </button>
                  {/* <button
                    onClick={(e) => {
                      editPlayer(v);
                    }}
                    className="btn btn-sm btn-dark ms-1"
                  >
                    Players
                  </button> */}
                  {/* <button
                    onClick={(e) => {
                      editMarket(v);
                    }}
                    className="btn btn-sm btn-dark ms-1"
                  >
                    Markets
                  </button> */}

                  <button
                    title="Remove Event"
                    className="btn btn-sm btn-danger ms-1"
                    onClick={(e) => {
                      overMatch(v.event_id);
                    }}
                  >
                    Remove
                  </button>
                  {/* </td> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {resultFlag && (
        <Result
          title={event_name}
          event_id={event_id}
          market_id={market_id}
          closeModal={closeModal}
        ></Result>
      )} */}

      {create && (
        <CreateEvent
          title={event_name}
          event_id={event_id}
          market_id={market_id}
          team1={team1}
          team2={team2}
          opendate={opendate}
          closedate={closedate}
          closeModal={closeModal}
        ></CreateEvent>
      )}
      {market && (
        <ResultList
          title={event_name}
          event_id={event_id}
          event_type={event_type}
          closeModal={closeModal}
        ></ResultList>
      )}

      {player && (
        <AddPlayer
          title={event_name}
          event_id={event_id}
          market_id={market_id}
          closeModal={closeModal}
        ></AddPlayer>
      )}
     
    </>
  );
};

export default EventList;
