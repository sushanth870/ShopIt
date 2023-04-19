import React, { Fragment, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Metadata from "./layout/Metadata";
import { getProducts } from "../Actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const keyword = match.params.keyword;
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [rating,setRating] = useState(0)
  const [category, setCategory] = useState("");
  const categories = {
    values: [
      "Electronics",
      "Cameras",
      "Laptops",
      "Accessories",
      "Headphones",
      "Food",
      "Books",
      "Clothes/Shoes",
      "Beauty/Health",
      "Sports",
      "Outdoor",
      "Home",
    ],
  };

  const { loading, products, error, productsCount, productsPerPage, filteredProductsCount } =
    useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts(currentPage, keyword, price, category, rating));

    if (error) {
      alert.success("Success");
      return alert.success(error);
    }
  }, [dispatch, alert, error, currentPage, category, keyword, price, rating]);

  function setCurrentPageNO(pageNumber) {
    setCurrentPage(pageNumber);
  }
let count = productsCount;
if(keyword){
 count = filteredProductsCount;
}
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title="Home" />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <h4>Price Range</h4>
                    <div className="px-5 mt-5">

                      <Range
                        marks={{ 1: `$1`, 1000: `$1000` }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{ placement: "top", visible: true }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                    </div>
                    <hr className="my-5" />
                    <div className="my-5">
                      <h4>Categories</h4>
                      <ul className='pl-0'>
                        {categories.values.map((category) => (
                          <li
                            key={category}
                            style={{ cursor: "pointer", listStyle: "none" }}
                            onClick={()=>setCategory(category)}
                          >
                            {category}
                          </li>
                        ))} 
                      </ul> 
                    </div>
                    <div className="my-5">
                      <h4>Ratings</h4>
                      <ul className='pl-0'>
                        {[5,4,3,2,1].map((star) => (
                          <li
                            key={star}
                            style={{ cursor: "pointer", listStyle: "none" }}
                            onClick={()=>setRating(star)}
                          ><span>Above {star}: </span>
                            <div className="rating-outer">
                                <div className="rating-inner" style={{width:`${star*20}%`}}>
                                  
                                </div> 
                            </div>
                          </li>
                        ))} 
                      </ul> 
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                  
                </Fragment>
              ) : (
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>
          {productsPerPage < count && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={productsPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNO}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
