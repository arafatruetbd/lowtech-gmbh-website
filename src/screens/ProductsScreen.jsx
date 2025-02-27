import { useParams } from "react-router-dom";
import { useGetCategoryProductsQuery, useGetCategoriesQuery } from "../slices/productsApiSlice";
import { Row, Col, Form } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { useState } from "react";

const ProductsScreen = () => {
  const { id: categoryId } = useParams(); // Get category ID from URL
  const { data: categories } = useGetCategoriesQuery(); // Fetch all categories
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryId); // Category filter

  // Fetch category products
  const { data, isLoading, error } = useGetCategoryProductsQuery({ categoryId: selectedCategory });

  // Filter products by price
  const filteredProducts = priceFilter
    ? data?.products?.filter((product) => product.price <= priceFilter)
    : data?.products;

  return (
    <>
      <Meta title={`Category - ${data?.category?.name}`} />
      <h1>Category: {data?.category?.name}</h1>

      {/* Filter Section - Side by Side */}
      <Row className="mb-4">
        {/* Price Filter */}
        <Col md={6}>
          <Form.Group controlId="priceFilter">
            <Form.Label>Filter by Price:</Form.Label>
            <Form.Control
              as="select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="50">Under $50</option>
              <option value="100">Under $100</option>
              <option value="200">Under $200</option>
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Category Filter */}
        <Col md={6}>
          <Form.Group controlId="categoryFilter">
            <Form.Label>Filter by Category:</Form.Label>
            <Form.Control
              as="select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            {filteredProducts?.map((product) => (
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

export default ProductsScreen;
