import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      // ✅ Extract only the necessary fields from cart items
      const orderItems = cart.cartItems.map(
        ({ id, name, qty, image, price }) => ({
          productId: id,
          name,
          qty,
          image,
          price,
        })
      );

      // ✅ Prepare the payload with required fields only
      const orderPayload = {
        orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: parseFloat(cart.itemsPrice),
        shippingPrice: parseFloat(cart.shippingPrice),
        taxPrice: parseFloat(cart.taxPrice),
        totalPrice: parseFloat(cart.totalPrice),
      };

      // ✅ Send order request with clean payload
      const res = await createOrder(orderPayload).unwrap();
      console.log(res);

      // ✅ Clear cart after successful order placement
      dispatch(clearCartItems());
      navigate(`/order/${res.orderId}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        {/* Left Section - Order Details */}
        <Col md={8}>
          <Card className="p-3 shadow-sm border-0 rounded">
            <ListGroup variant="flush">
              {/* Shipping Information */}
              <ListGroup.Item className="mb-2">
                <h2 className="text-primary fw-bold">Shipping</h2>
                <p className="mb-1">
                  <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>

              {/* Payment Method */}
              <ListGroup.Item className="mb-2">
                <h2 className="text-primary fw-bold">Payment Method</h2>
                <strong>Method: </strong> {cart.paymentMethod}
              </ListGroup.Item>

              {/* Order Items */}
              <ListGroup.Item>
                <h2 className="text-primary fw-bold">Order Items</h2>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="p-3 border rounded my-2 shadow-sm"
                      >
                        <Row className="align-items-center">
                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col md={5}>
                            <Link
                              to={`/product/${item.product}`}
                              className="text-decoration-none text-dark fw-semibold"
                            >
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={5} className="text-end fw-bold">
                            {item.qty} x ${item.price} = ${" "}
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* Right Section - Order Summary */}
        <Col md={4}>
          <Card className="p-3 shadow-lg border-0 rounded">
            <ListGroup variant="flush">
              <ListGroup.Item className="border-bottom pb-2">
                <h2 className="text-primary fw-bold">Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="fw-semibold">Items:</span>
                <span>${cart.itemsPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="fw-semibold">Shipping:</span>
                <span>${cart.shippingPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="fw-semibold">Tax:</span>
                <span>${cart.taxPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between border-top pt-2">
                <h4 className="fw-bold">Total:</h4>
                <h4>${cart.totalPrice}</h4>
              </ListGroup.Item>

              {/* Error Message */}
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error.data.message}</Message>
                </ListGroup.Item>
              )}

              {/* Place Order Button */}
              <ListGroup.Item className="text-center">
                <Button
                  type="button"
                  className="btn-lg w-100 py-3 fw-bold shadow"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
