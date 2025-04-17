const Footer = () => {
  return (
    <footer className="bg-[#bebec2] border-t border-[#41416e]/20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#41416e] mb-2">
            Smart Holder - Your Personal Finance Partner
          </h3>
          <p className="text-[#41416e]/80">
            Built with ❤️ by Najongchoon | Contact:{' '}
            <a
              href="mailto:najongchoon@gmail.com"
              className="text-[#41416e] hover:text-[#41416e]/80"
            >
              najongchoon@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 