import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ orderId, totalPrice, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [payOrder, { isLoading }] = usePayOrderMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      toast.error(error.message);
    } else {
      try {
        await payOrder({ orderId, details: { id: paymentMethod.id } });
        refetch();
        toast.success("Order is paid successfully!");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border rounded" />
      <Button type="submit" className="mt-3" disabled={!stripe || isLoading}>
        Pay ${totalPrice}
      </Button>
      {isLoading && <Loader />}
    </form>
  );
};

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <Elements stripe={stripePromise}>
      <Row className="g-4">
        {/* Left Section - Order Details */}
        <Col md={8}>
          <Card className="p-4 shadow-sm border-0 rounded">
            <ListGroup variant="flush">
              {/* Shipping Information */}
              <ListGroup.Item className="border-bottom pb-3">
                <h2 className="text-primary fw-bold">Shipping</h2>
                <p className="mb-1">
                  <strong>Name:</strong> {order.user.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${order.user.email}`}
                    className="text-decoration-none"
                  >
                    {order.user.email}
                  </a>
                </p>
                <p>
                  <strong>Address:</strong> {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                )}
              </ListGroup.Item>

              {/* Payment Method */}
              <ListGroup.Item className="border-bottom pb-3">
                <h2 className="text-primary fw-bold">Payment Method</h2>
                <p>
                  <strong>Method: </strong> Stripe
                </p>
                {order.isPaid ? (
                  <Message variant="success">Paid on {order.paidAt}</Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </ListGroup.Item>

              {/* Order Items */}
              <ListGroup.Item>
                <h2 className="text-primary fw-bold">Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
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
                              to={`/product/${item.id}`}
                              className="text-decoration-none text-dark fw-semibold"
                            >
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={5} className="text-end fw-bold">
                            {item.qty} x ${item.price} = $
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
          <Card className="p-4 shadow-lg border-0 rounded">
            <ListGroup variant="flush">
              <ListGroup.Item className="border-bottom pb-3">
                <h2 className="text-primary fw-bold">Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="fw-semibold">Items:</span>
                <span>${order.itemsPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="fw-semibold">Shipping:</span>
                <span>${order.shippingPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="fw-semibold">Tax:</span>
                <span>${order.taxPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between border-top pt-2">
                <h4 className="fw-bold">Total:</h4>
                <h4>${order.totalPrice}</h4>
              </ListGroup.Item>

              {/* Payment Section */}
              {!order.isPaid && (
                <ListGroup.Item>
                  <CheckoutForm
                    orderId={orderId}
                    totalPrice={order.totalPrice}
                    refetch={refetch}
                  />
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Elements>
  );
};

export default OrderScreen;
