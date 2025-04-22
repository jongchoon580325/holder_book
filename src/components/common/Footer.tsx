'use client';

export default function Footer() {
  return (
    <footer className="bg-[#bebec2] mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between text-sm text-[#41416e]/80">
          <div className="flex items-center gap-2">
            <span>Smart Holder - Your Personal Finance Partner</span>
            <span className="text-[#41416e]/60">|</span>
            <span>Built with ❤️ by Najongchoon</span>
            <span className="text-[#41416e]/60">|</span>
            <a
              href="mailto:najongchoon@gmail.com"
              className="text-[#41416e] hover:text-[#41416e]/80 transition-colors duration-200"
            >
              najongchoon@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#41416e] transition-colors duration-200">
              이용약관
            </a>
            <a href="#" className="hover:text-[#41416e] transition-colors duration-200">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-[#41416e] transition-colors duration-200">
              고객센터
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 