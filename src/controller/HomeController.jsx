import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import HomeLayout from "../containers/layouts/HomeLayout";
import FrontLayout from "../containers/layouts/FrontLayout";
import Loader from '../utilities/Loader'
import StoreContext from '../Store';

const DashBoard = React.lazy(() => import("../containers/views/Dash"));
//const CreateParty = React.lazy(() => import("../containers/views/CreateParty"));
const EventList = React.lazy(() => import("../containers/views/EventList"));
const MarketList = React.lazy(() => import("../containers/views/MarketList"));
const MarketListWithRunner = React.lazy(() => import("../containers/views/MarketListWithRunner"));
const Result = React.lazy(() => import("../containers/views/Result"));
const AC = React.lazy(() => import("../containers/views/AC"));
const Users = React.lazy(() => import("../containers/views/Users"));
// const ApiEventList = React.lazy(() => import("../containers/views/ApiEventList"));
// const MyEventList = React.lazy(() => import("../containers/views/EventList/MyEventList"));
// const EventData = React.lazy(() => import("../containers/views/EventData"));
const Profile = React.lazy(() => import("../containers/views/Profile"));
const ChangePassword = React.lazy(() => import("../containers/views/Profile/ChangePassword"));
const Gl = React.lazy(() => import("../containers/views/Users/AccountGeneral"));
const PL = React.lazy(() => import("../containers/views/PL"));

const MyPlayersSystem = React.lazy(() => import("../containers/views/MyPlayersSystem"));
const Bets = React.lazy(() => import("../containers/views/Bets"));
const AccountSummary = React.lazy(() => import("../containers/views/Summary/AccountSummary"));

const HomeController = (props) => {
  let { eventid, marketid, event_name } = useParams();
  let navigate = useNavigate();
  const store = useContext(StoreContext);
  const [role, setRole] = useState(parseInt(store.getItem("role")));
  const [email, setEmail] = useState(store.getItem("email"));
  const [part, setPart] = useState(store.getItem("part"));

  useEffect(() => {
    setRole(parseInt(store.getItem("role")))
    setEmail(store.getItem("email"))
    setPart(store.getItem("part"))
    console.log("controller call")
  }, [store])

  return (
    <>
    {email ? 
    <HomeLayout email={email} part={part} navigate={navigate} role={role} menu={props.menu ? props.menu : false}>
      <React.Suspense fallback={<Loader></Loader>}>
        
        {props.path === 'dashboard' && <DashBoard role={role} navigate={navigate}></DashBoard>}
        {/* {props.path === 'createparty' && <CreateParty role={role} navigate={navigate}></CreateParty>} */}
        
        {props.path === 'eventlist' && <EventList role={role} navigate={navigate}></EventList>}
        {props.path === 'marketlist' && <MarketList role={role} navigate={navigate}></MarketList>}
        {props.path === 'result' && <Result role={role} navigate={navigate}></Result>}
        {props.path === 'MarketListWithRunner' && <MarketListWithRunner role={role} navigate={navigate}></MarketListWithRunner>}
        {props.path === 'ac' && <AC role={role} navigate={navigate}></AC>}
        {props.path === 'users' && <Users role={role} navigate={navigate}></Users>}
        {props.path === 'pl' && <PL role={role} navigate={navigate}></PL>}
        {props.path === 'profile' && <Profile role={role}  navigate={navigate}></Profile>}
        {props.path === 'changepassword' && <ChangePassword role={role}  navigate={navigate}></ChangePassword>}
        {props.path === 'gl' && <Gl role={role} navigate={navigate}></Gl>}
        {props.path === 'bets' && <Bets role={role} navigate={navigate}></Bets>}
        {props.path === 'acsummary' && <AccountSummary role={role} navigate={navigate}></AccountSummary>}

        {props.path === 'myplayers' && <MyPlayersSystem role={role} navigate={navigate}></MyPlayersSystem>}
      </React.Suspense>
    </HomeLayout>
    :
    null
    }
    </>
  );

};

export default HomeController;
