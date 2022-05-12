import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Footer from "../Footer";
import Loading from "../Loading";

import AboutUs from "../../pages/AboutUs";
import AddChild from "../../pages/AddChild";
import ChildProfile from "../../pages/ChildProfile";
import ContactUs from "../../pages/ContactUs";
import LandingPage from "../../pages/LandingPage";
import UserProfile from "../../pages/UserProfile";
import UserRoleChooser from "../../pages/UserRoleChooser";
import SleepTracker from "../../pages/SleepTracker";
import TemperatureTracker from "../../pages/TemperatureTracker";
import FeedTracker from "../../pages/FeedTracker";
import SolidsTracker from "../../pages/SolidsTracker";
import NappyTracker from "../../pages/NappyTracker";
import WeightTracker from "../../pages/WeightTracker";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/chooserole" /> : <LandingPage />
          }
        />
        <Route path="/chooserole" element={<UserRoleChooser />} />
        <Route path="/addchild" element={<AddChild />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/childprofile/:childId" element={<ChildProfile />} />
        <Route path="/sleeptracker/:childId" element={<SleepTracker />} />
        <Route path="/feedtracker/:childId" element={<FeedTracker />} />
        <Route path="/solidtracker/:childId" element={<SolidsTracker />} />
        <Route path="/temperaturetracker/:childId" element={<TemperatureTracker />} />
        <Route path="/nappytracker/:childId" element={<NappyTracker />} />
        <Route path="/weighttracker/:childId" element={<WeightTracker />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
