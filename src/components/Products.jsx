import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        const products = await response.clone().json();
        setData(products);
        setFilter(products);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const Loading = () => {
    return (
      <>
        {[...Array(6)].map((_, index) => (
          <div className="col-md-4 col-sm-6 mb-4" key={index}>
            <Skeleton height={450} />
          </div>
        ))}
      </>
    );
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="text-center my-4">
          {["All", "men's clothing", "women's clothing", "jewelery", "electronics"].map((cat) => (
            <button
              key={cat}
              className="btn btn-outline-dark btn-sm mx-2 my-1"
              onClick={() => (cat === "All" ? setFilter(data) : filterProduct(cat))}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filter.map((product) => (
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex" key={product.id}>
            <div className="card product-card border-0 shadow-sm w-100 h-100">
              <div className="product-img-wrapper p-4 text-center">
                <img
                  src={product.image}
                  className="product-img"
                  alt={product.title}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="fw-semibold mb-2" title={product.title}>
                  {product.title.length > 50 ? product.title.slice(0, 50) + "..." : product.title}
                </h6>
                <p className="text-muted small mb-3">
                  {product.description.substring(0, 100)}...
                </p>
                <h5 className="fw-bold mb-3">${product.price.toFixed(2)}</h5>
                <div className="d-flex justify-content-between">
                  <Link to={`/product/${product.id}`} className="btn btn-outline-dark btn-sm">
                    Buy Now
                  </Link>
                  <button className="btn btn-dark btn-sm" onClick={() => addProduct(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="display-6 fw-bold">Our Latest Collections</h2>
        <p className="text-muted">Browse top categories and new arrivals</p>
        <hr className="w-25 mx-auto" />
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
