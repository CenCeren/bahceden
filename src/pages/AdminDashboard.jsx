import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", stock: 0, price: 0 });

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubOrders = onSnapshot(collection(db, "orders"), snapshot => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubProducts(); unsubOrders(); };
  }, []);

  const handleUpdateProduct = async (id, field, value) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { [field]: value });
  };

  const handleAddProduct = async () => {
    await addDoc(collection(db, "products"), newProduct);
    setNewProduct({ name: "", stock: 0, price: 0 });
  };

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Paneli</h1>

      <h2 className="text-xl mt-4">Ürünler</h2>
      {products.map(p => (
        <div key={p.id} className="flex gap-2 items-center mb-2">
          <input
            value={p.name}
            onChange={e => handleUpdateProduct(p.id, "name", e.target.value)}
          />
          <input
            type="number"
            value={p.stock}
            onChange={e => handleUpdateProduct(p.id, "stock", Number(e.target.value))}
          />
          <input
            type="number"
            value={p.price}
            onChange={e => handleUpdateProduct(p.id, "price", Number(e.target.value))}
          />
          <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-500 text-white px-2 rounded">Sil</button>
        </div>
      ))}

      <h3 className="mt-4">Yeni Ürün Ekle</h3>
      <input
        placeholder="İsim"
        value={newProduct.name}
        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stok"
        value={newProduct.stock}
        onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Fiyat"
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
      />
      <button onClick={handleAddProduct} className="bg-green-500 text-white px-2 rounded ml-2">Ekle</button>

      <h2 className="text-xl mt-6">Siparişler</h2>
      {orders.map(o => (
        <div key={o.id} className="border p-2 mb-2">
          {o.name} - {o.product} - {o.quantity} kg - {o.totalPrice} TL
        </div>
      ))}
    </div>
  );
}
