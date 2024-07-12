import { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Form as BootstrapForm,
} from "react-bootstrap";

const LOGIN_URL = "/auth";

const Login = () => {
  const { manageAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosPrivate.post(LOGIN_URL, {
        username: values.username,
        password: values.password,
      });
      const accessToken = response?.data?.accessToken;
      manageAuth(accessToken);
      navigate(`/user/${values.username}`, {
        replace: true,
      });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      // errRef.current.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="6">
          <h1>Login</h1>
          {errMsg && (
            <Alert variant="danger" ref={errRef} aria-live="assertive">
              {errMsg}
            </Alert>
          )}
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
              isSubmitting,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <BootstrapForm.Group controlId="formUsername">
                  <BootstrapForm.Label>Username</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="text"
                    name="username"
                    ref={userRef}
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={touched.username && !!errors.username}
                    placeholder="Enter username"
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.username}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId="formPassword">
                  <BootstrapForm.Label>Password</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                    placeholder="Enter password"
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.password}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <Button type="submit" disabled={isSubmitting} className="mt-3">
                  Login
                </Button>
              </Form>
            )}
          </Formik>
          <p className="mt-3">
            Need an Account? <Link to="/register">Register</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
