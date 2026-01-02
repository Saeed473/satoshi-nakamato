import Banner from "@/section/BannerSection";
import SatoshiCollection from "../main/page";

export default function Homepage() {
  return (
    <>
      <Banner />
      <SatoshiCollection />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* BRAND INTRO */}
        <div className="mb-14">
          <h1 className="text-4xl font-semibold mb-4">
            Satoshi Nakamoto Clothing
          </h1>
          <p className="text-lg text-gray-800 mb-2">
            Where Blockchain Meets Streetwear
          </p>
          <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
            Born from mystery and built on rebellion, Satoshi Nakamoto Clothing is more than just a fashion label — it’s a cultural movement.
            Inspired by the anonymous creator of Bitcoin, our pieces blend the decentralized mindset of cryptocurrency with the raw attitude
            of underground streetwear.
          </p>
        </div>

        {/* FEATURED DROP */}
        <div className="mb-14">
          <h2 className="text-2xl font-medium mb-3">
            Featured Drop: Satoshi Nakamoto x Vans
          </h2>
          <p className="text-sm text-gray-700 max-w-3xl">
            Meet the <strong>Satoshi OTW Old Skool 36</strong> — a rare collaboration where classic Vans design meets crypto legacy.
            This isn’t just footwear. It’s an encrypted message.
          </p>
        </div>

        {/* CORE COLLECTION OVERVIEW */}
        <div className="mb-16">
          <h2 className="text-2xl font-medium mb-6">
            Explore Our Core Collections
          </h2>
          <div className="space-y-6 text-sm text-gray-700 max-w-3xl">
            <p><strong>Hoodies</strong> — Rebellion in every thread.</p>
            <p><strong>T-Shirts</strong> — Minimal graphics. Maximum impact.</p>
            <p><strong>Pants & Shorts</strong> — Built for movement.</p>
            <p><strong>Accessories</strong> — Every piece carries the code.</p>
          </div>
        </div>
      </div>
    </>
  );
}
