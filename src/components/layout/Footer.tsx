import { FaInstagram, FaTiktok, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-12 space-y-8">
      
      {/* Logo */}
      <div className="flex justify-center">
        <img
          src="/logo.svg"
          alt="Twinstar Animation"
          className="h-16 w-auto"
        />
      </div>

      {/* Social links title */}
      <p className="text-lg font-medium">Social links</p>

      {/* Social icons */}
      <div className="flex justify-center gap-8 text-3xl">
        <FaInstagram className="cursor-pointer hover:opacity-70" />
        <FaTiktok className="cursor-pointer hover:opacity-70" />
        <FaYoutube className="cursor-pointer hover:opacity-70" />
        <FaTwitter className="cursor-pointer hover:opacity-70" />
      </div>

      {/* Footer links */}
      <div className="flex justify-center gap-6 text-sm opacity-70">
        <span className="cursor-pointer hover:opacity-100">About</span>
        <span className="cursor-pointer hover:opacity-100">FAQ</span>
        <span className="cursor-pointer hover:opacity-100">Licensing</span>
        <span className="cursor-pointer hover:opacity-100">Contact</span>
      </div>
    </footer>
  );
}