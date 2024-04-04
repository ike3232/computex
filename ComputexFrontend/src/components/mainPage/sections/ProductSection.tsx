// components/ProductsSection.tsx
import React, { useState, useEffect } from "react";
import ProductCard from "../ui/ProductCard";
import Section from "./Section";
import { fetchProducts } from "../../api/products";

interface Props {
  title: string;
  filterFn: (product: any) => boolean;
  inPromotion?: boolean;
}

const ProductsSection: React.FC<Props> = ({
  title,
  filterFn,
  inPromotion = false,
}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(filterFn).slice(0, 4);

  return (
    <Section title={title}>
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inPromotionSection={inPromotion}
        />
      ))}
    </Section>
  );
};

export default ProductsSection;
