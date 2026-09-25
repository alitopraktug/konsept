export default function ProductsLoading() {
  return (
    <div className="container-x py-12" role="status" aria-label="Ürünler yükleniyor">
      <div className="skeleton h-10 w-2/3 max-w-md" />
      <div className="skeleton mt-4 h-5 w-1/2 max-w-sm" />
      <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <div className="skeleton aspect-[4/5] w-full !rounded-2xl" />
            <div className="skeleton mt-3 h-4 w-1/3" />
            <div className="skeleton mt-2 h-5 w-3/4" />
            <div className="skeleton mt-2 h-4 w-full" />
            <div className="skeleton mt-4 h-11 w-full !rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
