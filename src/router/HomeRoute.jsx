import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeController from "../controller/HomeController";

const HomeRoute = (props) => {
  return (
    <React.Fragment>
      <Routes>
        <Route
          path="/dashboard"
          element={<HomeController path="dashboard" menu={true} />}
        />

        <Route
          path="/eventlist"
          element={<HomeController path="eventlist" menu={true} />}
        />
        <Route
          path="/marketlist"
          element={<HomeController path="marketlist" menu={true} />}
        />
        <Route
          path="/marketview/:eventid/:eventtype"
          element={<HomeController path="MarketListWithRunner" menu={true} />}
        />
        <Route
          path="/result/:eventid/:eventtype"
          element={<HomeController path="result" menu={true} />}
        />
        <Route path="/ac" element={<HomeController path="ac" menu={true} />} />
        <Route
          path="/users"
          element={<HomeController path="users" menu={true} />}
        />

        {/* <Route
          path="/apifancylist/:eventid"
          element={<HomeController path="apifancylist" menu={true} />}
        /> */}
        <Route
          path="/profile/"
          element={<HomeController path="profile" menu={true} />}
        />
        <Route
          path="/changepassword/"
          element={<HomeController path="changepassword" menu={true} />}
        />
        <Route path="/gl/" element={<HomeController path="gl" menu={true} />} />
        <Route path="/pl/" element={<HomeController path="pl" menu={true} />} />
        <Route
          path="/bets/"
          element={<HomeController path="bets" menu={true} />}
        />
        <Route
          path="/acsummary/"
          element={<HomeController path="acsummary" menu={true} />}
        />

        <Route
          path="/myplayers/"
          element={<HomeController path="myplayers" menu={true} />}
        />

        <Route path="/*" element={<HomeController path="*" />} />
      </Routes>
    </React.Fragment>
  );
};

export default HomeRoute;
