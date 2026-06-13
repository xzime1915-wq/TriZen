export function FaqAllProductsTitle({
  children = "FAQ ALL PRODUCTS",
}: {
  children?: string;
}) {
  return (
    <h2 className="trizen-display-title mb-8 md:mb-10">{children}</h2>
  );
}
