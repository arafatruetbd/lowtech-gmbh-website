import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Message from "./Message";
import { useGetAllBannersQuery } from "../slices/vendorSlice";

const BannerCarousel = () => {
  const { data: banners, isLoading, error } = useGetAllBannersQuery();

  return isLoading ? null : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause="hover" className="banner-carousel">
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <Link to={banner.link || "/"}>
            <Image
              src={banner.imageUrl}
              alt={banner.imageUrl}
              className="banner-image"
            />
            <Carousel.Caption className="banner-caption">
              <h2>{banner.link ? banner.link : "Discover More"}</h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
