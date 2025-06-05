import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductForm({
  product,
  onSubmit,
  onChange,
  submitText = 'Submit',
  showIdField = false,
  readOnly = false
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <form method="post" onSubmit={onSubmit}>
            <div className="row">
              {showIdField && (
                <div className="mb-3 col-md-6 col-lg-4">
                  <label className="form-label" htmlFor="product_id">Id</label>
                  <input 
                    readOnly 
                    id="product_id" 
                    name="id" 
                    className="form-control" 
                    onChange={onChange} 
                    value={product.id ?? ''} 
                    type="number" 
                    required 
                  />
                </div>
              )}
              <div className="mb-3 col-md-6 col-lg-4">
                <label className="form-label" htmlFor="product_name">Name</label>
                <input 
                  id="product_name" 
                  name="name" 
                  className="form-control" 
                  onChange={onChange} 
                  value={product.name ?? ''} 
                  maxLength="50" 
                  readOnly={readOnly}
                />
              </div>
              <div className="mb-3 col-md-6 col-lg-4">
                <label className="form-label" htmlFor="product_price">Price</label>
                <input 
                  id="product_price" 
                  name="price" 
                  className="form-control" 
                  onChange={onChange} 
                  value={product.price ?? ''} 
                  type="number" 
                  readOnly={readOnly}
                />
              </div>
              <div className="col-12">
                <Link className="btn btn-secondary" to="/product">Cancel</Link>
                {!readOnly && <button className="btn btn-primary">{submitText}</button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
