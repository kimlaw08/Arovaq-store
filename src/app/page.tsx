<div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
  <Link 
    href={`/product/${product.id}`}
    className="w-full md:w-auto text-center bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
  >
    Secure Checkout &bull; {product.currency} {product.price?.toLocaleString()}
  </Link>
  {product.handle && (
    <Link 
      href={`/${product.handle}`}
      className="text-xs text-slate-400 hover:text-white transition-colors"
    >
      View Creator Shelf →
    </Link>
  )}
</div>