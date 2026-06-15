import { ShopShowcaseProductCell } from "@/components/shop/ShopShowcaseProductCell";
import { cn } from "@/lib/utils";

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
  tag: string | null;
};

export function RelatedProducts({
  products,
}: {
  products: RelatedProduct[];
}) {
  if (products.length === 0) return null;

  const gridCols =
    products.length === 1
      ? "grid-cols-1"
      : products.length === 2
        ? "grid-cols-2"
        : products.length === 3
          ? "grid-cols-2 sm:grid-cols-3"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="shop-glass-showcase pt-12 md:pt-16 lg:pt-20">
      <div className="edition-showcase-section edition-showcase-v1 edition-showcase-v1--shop">
        <h3 className="product-related-heading">More from Trizen Store</h3>

        <div className={cn("grid bg-white edition-showcase-shop-grid", gridCols)}>
          {products.map((product) => (
            <ShopShowcaseProductCell
              key={product.id}
              href={`/product/${product.slug}`}
              label={product.name}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                compareAt: product.compareAt,
                image: product.image,
                stock: product.stock,
                tag: product.tag,
              }}
              imageSrc={product.image}
              imageAlt={product.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
