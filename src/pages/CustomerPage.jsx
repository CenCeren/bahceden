import React, { useState, useEffect } from "react";
import { db, serverTimestamp } from "../firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc } from "firebase/firestore";

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState({ product: "", quantity: 1, name: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === selected.product);
    if (!product) return;
    if (selected.quantity < 1 || selected.quantity > 10) {
      setMessage("1–10 kg arası seçim yapabilirsiniz.");
      return;
    }
    if (selected.quantity > product.stock) {
      setMessage("Yeterli stok yok.");
      return;
    }

    // Siparişi ekle
    await addDoc(collection(db, "orders"), {
      name: selected.name,
      product: product.name,
      quantity: selected.quantity,
      totalPrice: product.price * selected.quantity,
      timestamp: serverTimestamp()
    });

    // Stok güncelle
    const productRef = doc(db, "products", product.id);
    await updateDoc(productRef, { stock: product.stock - selected.quantity });

    setMessage("Siparişiniz kaydedilmiştir.");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Ürünlerimiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          required
          value={selected.product}
          onChange={e => setSelected({ ...selected, product: e.target.value })}
        >
          <option value="">Ürün Seçiniz</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.stock} kg - {p.price} TL/kg
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          max="10"
          value={selected.quantity}
          onChange={e => setSelected({ ...selected, quantity: Number(e.target.value) })}
          placeholder="Kaç kg"
        />
        <input
          type="text"
          value={selected.name}
          onChange={e => setSelected({ ...selected, name: e.target.value })}
          placeholder="İsminiz"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Sipariş Ver
        </button>
      </form>
      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
}
