import { Row, Col } from "react-bootstrap";
import { useGetLatestProductsQuery } from "../slices/productsApiSlice";
import { useGetCategoriesQuery } from "../slices/categoryApiSlice"; // ✅ Import categories
import { Link } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import BannerCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
  // ✅ Fetch categories and products
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();
  const { data: products, isLoading, error } = useGetLatestProductsQuery();

  return (
    <>
      <BannerCarousel />
      {/* ✅ Display Categories */}
      {categoriesLoading ? (
        <Loader />
      ) : categoriesError ? (
        <Message variant="danger">
          {categoriesError?.data?.message || categoriesError.error}
        </Message>
      ) : (
        <>
          <h2 className="mt-4">Shop by Category</h2>
          <Row>
            <Row className="g-3">
              {" "}
              {/* ✅ Add gap between rows */}
              {categories?.map((category) => (
                <Col key={category.id} sm={6} md={4} lg={3}>
                  <Link
                    to={`/category/${category.id}`}
                    className="category-card"
                  >
                    <div className="category-box">
                      <h4>{category.name}</h4>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Row>
        </>
      )}

      {/* ✅ Display Products */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Latest Products</h1>
          <Row>
            {products?.map((product) => (
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

export default HomeScreen;
