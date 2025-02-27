import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  console.log(cart);

  // NOTE: no need for an async function here as we are not awaiting the
  // resolution of a Promise
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      {/* Left Column - Cart Items */}
      <Col md={8}>
        <h1 className="mb-4 text-primary">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="p-3 border rounded shadow-sm"
              >
                <Row className="align-items-center">
                  {/* Product Image */}
                  <Col md={2}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                      className="shadow-sm"
                    />
                  </Col>

                  {/* Product Name */}
                  <Col md={3}>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-decoration-none fw-bold"
                    >
                      {item.name}
                    </Link>
                  </Col>

                  {/* Product Price */}
                  <Col md={2} className="fw-semibold text-success">
                    ${item.price}
                  </Col>

                  {/* Quantity Selector */}
                  <Col md={2}>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                      className="border-0 shadow-sm"
                    >
                      {[...Array(item.stock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Remove Button */}
                  <Col md={2}>
                    <Button
                      variant="danger"
                      className="shadow-sm"
                      onClick={() => removeFromCartHandler(item.id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      {/* Right Column - Order Summary */}
      <Col md={4}>
        <Card className="shadow-lg border-0">
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-light">
              <h2 className="fw-bold">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              <span className="fs-4 text-primary fw-bold">
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </ListGroup.Item>

            <ListGroup.Item className="p-3">
              <Button
                type="button"
                className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
