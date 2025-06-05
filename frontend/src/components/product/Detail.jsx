import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Service from './Service';
import ProductForm from './ProductForm';

export default function ProductDetail(props) {
  const [product, setProduct] = useState({});
  
  useEffect(() => {
    get();
  }, [props.match.params.id]);
  
  function get() {
    return Service.get(props.match.params.id)
      .then(response => {
        setProduct(response.data);
      })
      .catch(e => {
        alert(e.response.data);
      });
  }

  return (
    <ProductForm
      product={product}
      readOnly={true}
      showIdField={true}
      customActions={
        <>
          <Link className="btn btn-secondary" to="/product">Back</Link>
          <Link className="btn btn-primary" to={`/product/edit/${product.id}`}>Edit</Link>
        </>
      }
    />
  );
}
