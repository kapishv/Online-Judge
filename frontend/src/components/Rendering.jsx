import { Container, Spinner } from "react-bootstrap";

const Rendering = () => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Spinner animation="border" />
    </Container>
  );
};

export default Rendering;
