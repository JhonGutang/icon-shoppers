const AboutUs = () => {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-full px-10">
        <div>Empowering local businesses, uplifting local lives.</div>
        <div className="text-3xl mb-4 flex gap-2">
            Your 
            <div className="text-green-500">
            Online Shopping 
            </div>
            
            Destination</div>
        <div>
          We&lsquo;re a homegrown platform built to connect the vibrant local shops of
          Balamban, Pinamungajan, and Toledo with the communities they serve.
          Our mission is simple &mdash; to make it easier for people to discover,
          support, and shop from small businesses right in their own backyard.
          Whether it&lsquo;s handcrafted goods, fresh local produce, or neighborhood
          favorites, we&lsquo;re here to bring West Cebu&lsquo;s best straight to your
          screen. Shop local, support local &mdash; because every purchase helps a
          neighbor thrive.
        </div>
      </div>
      <div className="w-full h-full py-20">
        <img src="/cart.jpg" alt="" className="object-contain h-full w-full" />
      </div>
    </div>
  );
};

export default AboutUs;
