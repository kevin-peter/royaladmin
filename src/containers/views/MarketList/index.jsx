import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import StoreContext from "../../../Store";

import CreateEvent from "./CreateEvent";

import {
  EyeIcon,
  LockClosedIcon,
  UserCircleIcon,
  CogIcon,
} from "@heroicons/react/24/solid";

const MarketList = (props) => {
  const store = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [marketList, setMarketList] = useState([]);
  const [create, setCreate] = useState(false);
  const [displayOrder, setDisplayOrder] = useState([]);

  //const [id, setId] = useState("");
  const [event_id, setEventId] = useState("");
  const [market_id, setMarketId] = useState("");
  const [marketName, setMarketName] = useState("");
  const [message, setMessage] = useState();
  const [errorClass, setErrorClass] = useState("alert alert-success");

  const closeModal = async (e) => {
    setEventId("");
    setMarketName("");
    setCreate(false);

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

    fetch(
      import.meta.env.VITE_API_HOST + "/setting/getDefaultMrkt",
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
        if (result.data) setMarketList(result.data);
        let fields1 = { ...displayOrder };
        for (let i = 0; i < result.data.length; i++) {
          fields1 = {
            ...fields1,
            [result.data[i]["id"]]: result.data[i]["display_order"],
          };
        } //for

        setDisplayOrder(fields1);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const delMarket = async (id) => {
    if (!window.confirm("sure to delete this event?")) return;
    const urlencoded = {
      id: id,
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

    fetch(import.meta.env.VITE_API_HOST + "/setting/delMarket", requestOptions)
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

  const editEvent = async (e) => {
    setEventId(e.event_id);
    setMarketName(e.marketName);

    setTimeout(() => {
      setCreate(true);
    }, 5);
  };

  const lockMarket = async (flag, type, market_id, index) => {
    //if (!window.confirm("sure to change?")) return;
    setLoading(true);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + localStorage.getItem("jwt"));

    const urlencoded = {
      market_id: market_id,
    };

    if (type === "status") {
      urlencoded.status = flag;
    } else if (type === "visible") {
      urlencoded.visible = flag;
    } else if (type === "locked") {
      urlencoded.locked = flag;
    } else if (type === "runner_type") {
      urlencoded.runner_type = flag;
    } else if (type === "display_order") {
      urlencoded.display_order = flag;
    } else if (type === "runner_count") {
    urlencoded.runner_count = flag;
  }

    let requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(urlencoded),
    };

    fetch(import.meta.env.VITE_API_HOST + "/setting/lockMarket", requestOptions)
      .then((response) => {
        if (response.status === 401) {
          props.navigate(`/login`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.message) {
          let rn = [...marketList];
          if (type === "status") {
            rn[index].status = flag;
          } else if (type === "visible") {
            rn[index].visible = flag;  
          } else if (type === "locked") {
            rn[index].locked = flag;  
          } else if (type === "runner_count") {
            rn[index].runner_count = flag;
          }  
          // } else if (type === "runner_type") {
          //   rn[index].runner_type = flag;
          // }
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

  const handleEnterKey = async (id, k, event) => {
    if (event.key === "Enter") {
      //console.log(k)
      //console.log(event.target.value)
      // Handle the Enter key press event
      await lockMarket(event.target.value, "display_order", id, k);
    }
  };

  const handleInputChange = async (i, event) => {
    setDisplayOrder({
      ...displayOrder,
      [i]: event.target.value,
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">- : Market List : -</h1>
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
              <th className="px-2 py-1 text-left">Market Name</th>
              <th className="px-2 py-1 text-left">Runner Count</th>
              <th className="px-2 py-1 text-left">Runner Type</th>
              <th className="px-2 py-1 text-left">Display Order</th>
              <th className="px-2 py-1 text-left">Status</th>
              <th className="px-2 py-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {marketList.map((v, k) => (
              <tr
                role="button"
                title={v.name}
                className="bg-white dark:bg-sky-300/10 dark:border-blue-500 border-primary-300"
              >
                <td className="text-center px-2 py-1" width="5%">
                  {k + 1}
                </td>
                <td className="text-left px-2 py-1" width="50%">
                  {v.name}
                </td>
                <td className="text-left px-2 py-1" width="10%">
                  {/* {v.runner_count == 0 ? "-" : v.runner_count} */}
                  {/* <select
                    onChange=""
                    className="form-select"
                    value={v.runner_count}
                  >
                    {[...Array(11).keys()].map((i) => (
                      <option key={i} value={i}>
                        {i === 0 ? "-" : i}
                      </option>
                    ))}
                  </select> */}

                  <select
                    className="form-select"
                    value={v.runner_count}
                    onChange={async (event) => {
                      await lockMarket(
                        event.target.value,
                        "runner_count",
                        v.id,
                        k
                      );
                    }}
                  >
                    {[...Array(11).keys()].map((i) => (
                      <option key={i} value={i}>
                        {i === 0 ? "-" : i}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="text-left px-2 py-1" width="10%">
                  {v.runner_type}

                  {/* <select
                    className="form-select"
                    value={v.runner_type || "ALL"} // Use a default value if v.runner_type is null
                    onChange={async (event) => {
                      await lockMarket(
                        event.target.value,
                        "runner_type",
                        v.id,
                        k
                      );
                    }}
                  >
                    <option key="NONE" value="NONE">
                      NONE
                    </option>
                    <option key="BETTER" value="BATTER">
                      BATTER
                    </option>
                    <option key="BOWLER" value="BOWLER">
                      BOWLER
                    </option>
                    <option key="TEAMS" value="TEAM">
                      TEAM
                    </option>
                    <option key="ALL" value="ALL">
                      ALL
                    </option>
                    <option key="HALF" value="HALF">
                      HALF
                    </option>
                    <option key="CUSTOM" value="CUSTOM">
                      CUSTOM
                    </option>
                  </select> */}
                </td>
                <td className="text-left px-2 py-1" width="10%">
                  <input
                    key={k}
                    type="text"
                    name={v.id}
                    value={displayOrder[v.id]}
                    className="form-control form-control-sm"
                    onChange={(e) => handleInputChange(v.id, e)}
                    onKeyDown={(e) => handleEnterKey(v.id, k, e)}

                    // onChange={async (event) => {
                    //   await lockMarket(
                    //     event.target.value,
                    //     "display_order",
                    //     v.id,
                    //     k
                    //   );
                    // }}
                  />
                </td>
                <td className="text-center px-2 py-1" width="5%">
                  {/* <button className={v.status==1 ? "btn btn-sm btn-success ms-1" : "btn btn-sm btn-danger ms-1"}
                    >
                      {(v.status==1) ? 'ON' : 'OFF'}
                    </button> */}

                  <button
                    title="Market Status"
                    onClick={async () => {
                      await lockMarket(
                        v.status === null ? false : !v.status,
                        "status",
                        v.id,
                        k
                      );
                    }}
                    className={`btn btn-sm ${
                      v.status === null || Boolean(v.status) === true
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                  >
                    {v.status == 1 ? "ON" : "OFF"}
                  </button>
                </td>

                <td className="text-center text-xs">
                <button
                    title="Market Visible"
                    onClick={async () => {
                      await lockMarket(
                        v.visible === null ? false : !v.visible,
                        "visible",
                        v.id,
                        k
                      );
                    }}
                    className={`btn btn-sm ms-1 mr-1 ${
                      v.visible === null || Boolean(v.visible) === true
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                  >
                    <EyeIcon className="w-6"></EyeIcon>
                  </button> 
                  <button
                    title="Market Lock"
                    onClick={async () => {
                      await lockMarket(
                        v.locked === null ? false : !v.locked,
                        "locked",
                        v.id,
                        k
                      );
                    }}
                    className={`btn btn-sm ms-1 ${
                      v.locked === null || Boolean(v.locked) === false
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                    disabled={loading}
                  >
                    <LockClosedIcon className="w-6"></LockClosedIcon>
                  </button>

                  {/* <button
                    title="Remove Event"
                    className="btn btn-sm btn-danger ms-1"
                    // onClick={(e) => {
                    //   delMarket(v.id);
                    // }}
                  >
                    Remove
                  </button> */}
                  {/* </td> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {create && (
        <CreateEvent title={marketName} closeModal={closeModal}></CreateEvent>
      )}
    </>
  );
};

export default MarketList;
