import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
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

const REGISTER_URL = "/register";

const Register = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();
  const { manageAuth } = useContext(AuthContext);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axiosPrivate.post(REGISTER_URL, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      // Assuming registration response includes necessary data
      const accessToken = response?.data?.accessToken;
      manageAuth(accessToken);
      navigate(`/user/${values.username}`, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setFieldError("general", "No Server Response");
      } else if (err.response?.status === 409) {
        setFieldError("username", "Username Taken");
      } else {
        setFieldError("general", "Registration Failed");
      }
      errRef.current.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(
        /^[A-z][A-z0-9-_]{3,23}$/,
        "Username must start with a letter and be 4-24 characters long."
      )
      .required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        "Password must be 8-24 characters long and include uppercase, lowercase, number, and special character."
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="6">
          <h1>Register</h1>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
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
              setFieldError,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {errors.general && (
                  <Alert variant="danger" ref={errRef} aria-live="assertive">
                    {errors.general}
                  </Alert>
                )}

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

                <BootstrapForm.Group controlId="formEmail">
                  <BootstrapForm.Label>Email</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                    placeholder="Enter email"
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.email}
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

                <BootstrapForm.Group controlId="formConfirmPassword">
                  <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    isInvalid={
                      touched.confirmPassword && !!errors.confirmPassword
                    }
                    placeholder="Confirm password"
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <Button type="submit" disabled={isSubmitting} className="mt-3">
                  Register
                </Button>
              </Form>
            )}
          </Formik>
          <p className="mt-3">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
