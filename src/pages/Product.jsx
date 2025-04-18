import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);

      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => (
    <div className="container my-5 py-4">
      <div className="row">
        <div className="col-md-6">
          <Skeleton height={400} />
        </div>
        <div className="col-md-6">
          <Skeleton height={40} width={300} />
          <Skeleton height={30} />
          <Skeleton height={60} />
          <Skeleton height={150} />
          <Skeleton height={40} width={120} />
          <Skeleton className="mx-2" height={40} width={120} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-6">
          <h6 className="text-uppercase text-muted mb-2">{product.category}</h6>
          <h2 className="fw-bold mb-3">{product.title}</h2>
          <p className="text-warning fs-5 mb-2">
            {product.rating && product.rating.rate} ★
          </p>
          <h3 className="text-success fw-bold mb-3">${product.price}</h3>
          <p className="text-muted mb-4">{product.description}</p>
          <div className="d-flex gap-3">
            <button
              className="btn btn-outline-primary px-4 py-2"
              onClick={() => addProduct(product)}
            >
              <i className="fa fa-cart-plus me-2"></i>Add to Cart
            </button>
            <Link to="/cart" className="btn btn-dark px-4 py-2">
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const Loading2 = () => (
    <div className="d-flex gap-4 py-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} height={400} width={250} />
      ))}
    </div>
  );

  const ShowSimilarProduct = () => (
    <div className="d-flex py-4">
      {similarProducts.map((item) => (
        <div
          key={item.id}
          className="card mx-3 shadow border-0"
          style={{
            minWidth: "250px",
            maxWidth: "250px",
            borderRadius: "15px",
            overflow: "hidden",
            transition: "transform 0.3s",
          }}
        >
          <img
            src={item.image}
            className="card-img-top p-3"
            alt={item.title}
            style={{ height: "250px", objectFit: "contain" }}
          />
          <div className="card-body">
            <h6 className="card-title fw-semibold mb-2 text-truncate">
              {item.title}
            </h6>
            <p className="text-success fw-bold mb-2">${item.price}</p>
            <div className="d-flex justify-content-center gap-2">
              <Link to={`/product/${item.id}`} className="btn btn-sm btn-primary">
                Buy Now
              </Link>
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => addProduct(item)}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="my-5">
          <h2 className="mb-4 text-center fw-bold">You May Also Like</h2>
          <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
            {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
          </Marquee>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
