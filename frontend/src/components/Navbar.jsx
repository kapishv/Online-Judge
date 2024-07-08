import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Navbar, Container, Nav } from "react-bootstrap";

const UserNavbar = () => {
  const { auth, logout } = useContext(AuthContext);
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CodeCraft
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/problemset">
              Problems
            </Nav.Link>
            {auth.isAdmin ? (
              <Nav.Link as={Link} to="/problem">
                Problem Dashboard
              </Nav.Link>
            ) : auth.isAuthenticated ? (
              <Nav.Link as={Link} to="/submissions">
                Submissions
              </Nav.Link>
            ) : null}
            <Nav.Link as={Link} to="/leaderboard">
              Leaderboard
            </Nav.Link>
          </Nav>
          <Nav>
            {auth.isAuthenticated ? (
              <>
                <Nav.Link as={Link} to={`/user/${auth?.user}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
