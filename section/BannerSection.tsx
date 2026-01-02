import Image from "next/image";

const Banner = () => {
  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh] overflow-hidden">
      <Image
        src="/satoshi-nakamoto-banner.jpg"
        alt="Banner Image"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
    </section>
  );
};

export default Banner;