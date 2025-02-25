import { useState, useEffect } from "react";
import { Form, Button, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Card className="p-4 border-0 shadow-lg rounded">
        <h2 className="text-primary text-center fw-bold mb-3">
          Payment Method
        </h2>

        <Form onSubmit={submitHandler} className="mt-3">
          <Form.Group>
            <Form.Label className="fw-semibold mb-2">
              Select Payment Method
            </Form.Label>

            {/* ✅ Fixed Radio Button Inside Border */}
            <Col className="d-flex flex-column">
              <div className="p-3 border rounded bg-light shadow-sm my-2 d-flex align-items-center">
                <Form.Check
                  type="radio"
                  id="Stripe"
                  name="paymentMethod"
                  value="Stripe"
                  defaultChecked
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="me-2"
                />
                <label htmlFor="Stripe" className="mb-0 fs-5">
                  Stripe or Credit Card
                </label>
              </div>
            </Col>
          </Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-100 py-3 mt-3 fw-bold shadow-sm"
          >
            Continue
          </Button>
        </Form>
      </Card>
    </FormContainer>
  );
};

export default PaymentScreen;
