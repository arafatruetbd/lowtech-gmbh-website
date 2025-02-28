import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow-lg border-0 rounded p-4">
          <h2 className="text-center text-primary fw-bold">Sign In</h2>

          <Form onSubmit={submitHandler} className="mt-3">
            {/* Email Input */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border rounded"
              />
            </Form.Group>

            {/* Password Input */}
            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 border rounded"
              />
            </Form.Group>

            {/* Sign In Button */}
            <Button
              disabled={isLoading}
              type="submit"
              variant="primary"
              className="w-100 py-3 fw-bold shadow-sm"
            >
              Sign In
            </Button>

            {isLoading && <Loader className="mt-3" />}
          </Form>

          {/* Register Link */}
          <Row className="mt-4 text-center">
            <Col>
              <p className="mb-0">
                New Customer?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="fw-bold text-primary"
                >
                  Register Here
                </Link>
              </p>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginScreen;
