import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import PostsList from "./PostsList";
import Signup from "./Signup";
import Login from "./Login";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Error from "./Error";
import UserProfile from "./UserProfile";
import { useParams } from 'react-router-dom';
import FriendList from "./FriendList";
import PostForm from "./PostForm";
import PostFormEdit from "./PostFormEdit";
import ProfileFormEdit from "./ProfileFormEdit";

function App() {
  const { AuthToken, currentUser } = useContext(AuthContext)
  const location = useLocation();
  const isAuth = AuthToken ? true : false

  const hideNavbarRoutes = ['/signup', '/Login'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    // <Router>
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={isAuth ? <PostsList /> : <Navigate to="/Login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={isAuth ? <UserProfile sentUser={currentUser} /> : <Navigate to="/Login" />} />
        <Route path="/user/:id" element={isAuth ? <UserProfileWrapper /> : <Navigate to="/Login" />} />
        <Route path="/friends" element={isAuth ? <FriendList option={'friends'} /> : <Navigate to="/Login" />} />
        <Route path="/friendRequests" element={isAuth ? <FriendList option={'received'} /> : <Navigate to="/Login" />} />
        <Route path="/postForm" element={isAuth ? <PostForm /> : <Navigate to="/Login" />} />
        <Route path="/postForm/:id/edit" element={isAuth ? <PostFormEditWrapper /> : <Navigate to="/Login" />} />
        <Route path="/profile/edit" element={isAuth ? <ProfileFormEdit /> : <Navigate to="/Login" />} />
        <Route path="/search" element={isAuth ? <FriendList key={'search'} option={'users'}/> : <Navigate to="/Login" />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
    // </Router>
  );
}

// Wrapper component to extract the id from URL and pass it as a prop
const UserProfileWrapper = () => {
  const { id } = useParams();
  return <UserProfile key={id} id={id} />;
};

const PostFormEditWrapper = ()=>{
  const { id } = useParams();
  return <PostFormEdit id={id}/>
}

export default App;
