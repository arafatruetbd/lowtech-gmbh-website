import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../slices/cartSlice";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <Card className="p-4 border-0 shadow-lg rounded">
        <h2 className="text-primary text-center fw-bold mb-3">
          Shipping Details
        </h2>
        <Form onSubmit={submitHandler} className="mt-3">
          {/* Address Input */}
          <Form.Group className="mb-3" controlId="address">
            <Form.Label className="fw-semibold">Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              className="p-3 rounded border-light shadow-sm"
            />
          </Form.Group>

          {/* City Input */}
          <Form.Group className="mb-3" controlId="city">
            <Form.Label className="fw-semibold">City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              className="p-3 rounded border-light shadow-sm"
            />
          </Form.Group>

          {/* Postal Code Input */}
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label className="fw-semibold">Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
              className="p-3 rounded border-light shadow-sm"
            />
          </Form.Group>

          {/* Country Input */}
          <Form.Group className="mb-4" controlId="country">
            <Form.Label className="fw-semibold">Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
              className="p-3 rounded border-light shadow-sm"
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-100 py-3 fw-bold shadow-sm"
          >
            Continue
          </Button>
        </Form>
      </Card>
    </FormContainer>
  );
};

export default ShippingScreen;
