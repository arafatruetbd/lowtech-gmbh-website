import React from "react";
import { Row, Col, Card, ListGroup, Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";

const ProfileScreen = () => {
  const { user } = useSelector((state) => state.auth.userInfo);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  return (
    <Row className="g-4">
      {/* Left Section - User Profile */}
      <Col md={4}>
        <Card className="shadow-lg border-0 rounded">
          <Card.Body>
            <h2 className="text-primary fw-bold">User Profile</h2>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Name:</strong> {user.name}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${user.email}`}
                  className="text-decoration-none"
                >
                  {user.email}
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>

      {/* Right Section - Order History */}
      <Col md={8}>
        <Card className="shadow-lg border-0 rounded">
          <Card.Body>
            <h2 className="text-primary fw-bold">My Orders</h2>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <Table striped hover responsive className="table-sm mt-3">
                <thead className="bg-light">
                  <tr className="text-center">
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="text-center">
                      <td className="fw-semibold">{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? (
                          <span className="text-success fw-bold">
                            {order.paidAt.substring(0, 10)}
                          </span>
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className="text-success fw-bold">
                            {order.deliveredAt.substring(0, 10)}
                          </span>
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/order/${order.id}`}
                          variant="outline-dark"
                          className="btn-sm fw-bold"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
