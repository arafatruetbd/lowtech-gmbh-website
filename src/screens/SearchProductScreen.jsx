import { useParams } from "react-router-dom";
import {
  useGetProductsBySearchQuery,
} from "../slices/productsApiSlice";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";

const SearchProductScreen = () => {
  const { keyword, pageNumber = 1 } = useParams(); // Get search keyword from URL

  const { data, isLoading, error } = useGetProductsBySearchQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta title={`Search results for "${keyword}"`} />
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <h1>Search Results for "{keyword}"</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : data.products.length === 0 ? (
        <Message variant="info">No products found</Message>
      ) : (
        <>
          <Row>
            {data.products.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default SearchProductScreen;
