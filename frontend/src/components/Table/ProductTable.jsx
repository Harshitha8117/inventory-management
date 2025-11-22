import React from 'react';
import ProductRow from './ProductRow';

export default function ProductTable({products, onUpdate, onSelect}){
  return (
    <table border="1" cellPadding="8" style={{width:'100%', borderCollapse:'collapse'}}>
      <thead><tr>
        <th>Image</th><th>Name</th><th>Unit</th><th>Category</th><th>Brand</th><th>Stock</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {products.map(p => <ProductRow key={p.id} product={p} onUpdate={onUpdate} onSelect={onSelect} />)}
      </tbody>
    </table>
  );
}
