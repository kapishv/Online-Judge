import { Navbar, Container } from "react-bootstrap";

const Footer = () => {
  return (
    <Navbar bg="dark" variant="dark" fixed="bottom" className="footer mt-auto py-3">
      <Container className="justify-content-center">
        <span className="text-light">
          Copyright &copy; {new Date().getFullYear()} CodeCraft
        </span>
      </Container>
    </Navbar>
  );
};

export default Footer;
