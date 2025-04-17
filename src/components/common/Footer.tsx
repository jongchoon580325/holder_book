'use client';

export default function Footer() {
  return (
    <footer className="bg-[#bebec2] mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-[#41416e]/80">
            <h3 className="text-lg font-semibold text-[#41416e] mb-2">
              Smart Holder - Your Personal Finance Partner
            </h3>
            <p className="text-sm">
              Built with ❤️ by Najongchoon | Contact:{' '}
              <a
                href="mailto:najongchoon@gmail.com"
                className="text-[#41416e] hover:text-[#41416e]/80 transition-colors duration-200"
              >
                najongchoon@gmail.com
              </a>
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-[#41416e]/80 hover:text-[#41416e] transition-colors duration-200">
              이용약관
            </a>
            <a href="#" className="text-[#41416e]/80 hover:text-[#41416e] transition-colors duration-200">
              개인정보처리방침
            </a>
            <a href="#" className="text-[#41416e]/80 hover:text-[#41416e] transition-colors duration-200">
              고객센터
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 