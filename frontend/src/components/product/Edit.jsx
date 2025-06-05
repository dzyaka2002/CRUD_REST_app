import React, { useState, useEffect } from 'react';
import Service from './Service';
import ProductForm from './ProductForm';

export default function ProductEdit(props) {
  const [product, setProduct] = useState({});
  
  useEffect(() => {
    get();
  }, [props.match.params.id]);
  
  function get() {
    return Service.edit(props.match.params.id).then(response => {
      setProduct(response.data);
    }).catch(e => {
      alert(e.response.data);
    });
  }

  function edit(e) {
    e.preventDefault();
    Service.edit(props.match.params.id, product).then(() => {
      props.history.push('/product');
    }).catch((e) => {
      alert(e.response.data);
    });
  }

  function onChange(e) {
    let data = { ...product };
    data[e.target.name] = e.target.value;
    setProduct(data);
  }

  return (
    <ProductForm
      product={product}
      onSubmit={edit}
      onChange={onChange}
      submitText="Save"
      showIdField={true}
    />
  );
}
