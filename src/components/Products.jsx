import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
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
          <div className="col-md-4 col-sm-6 col-12 mb-4" key={index}>
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
            <div className="card shadow-sm w-100 h-100 border-0">
              <img
                src={product.image}
                className="card-img-top p-4"
                alt={product.title}
                style={{ height: "300px", objectFit: "contain" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="card-title fw-bold">
                  {product.title.length > 45 ? product.title.substring(0, 45) + "..." : product.title}
                </h6>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {product.description.substring(0, 100)}...
                </p>
                <h5 className="mt-2 mb-3">${product.price}</h5>
                <div className="d-flex justify-content-between">
                  <Link to={`/product/${product.id}`} className="btn btn-outline-dark btn-sm">
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => {
                      addProduct(product);
                      toast.success("Added to cart");
                    }}
                  >
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
        <h2 className="display-5 fw-bold">Explore Our Products</h2>
        <hr className="w-25 mx-auto" />
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
