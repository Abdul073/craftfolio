import { useState } from "react";
import { motion } from "framer-motion";
import { X, Rocket, Loader2, CheckCircle, Share2, Twitter, Linkedin, Facebook, Link2 } from "lucide-react";
import { Button } from "./ui/button";
import { ColorTheme } from "@/lib/colorThemes";
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { newPortfolioData } from "@/slices/dataSlice";
import { updatePortfolio, deployPortfolio } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import Confetti from "react-confetti";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  portfolioData: any;
  portfolioLink?: string;
}

const DeployModal = ({ isOpen, onClose, portfolioId, portfolioData, portfolioLink }: DeployModalProps) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const [isDeploying, setIsDeploying] = useState(false);
  const [portfolioSlug, setPortfolioSlug] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");

  const validatePortfolioSlug = (slug: string) => {
    if (slug.length < 3 || slug.length > 30) {
      toast.error("Portfolio slug must be between 3 and 30 characters");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error("Portfolio slug can only contain lowercase letters, numbers, and hyphens");
      return false;
    }
    if (slug.startsWith('-') || slug.endsWith('-')) {
      toast.error("Portfolio slug cannot start or end with a hyphen");
      return false;
    }
    return true;
  };

  const handleDeploy = async () => {
    if (!user || user.id !== portfolioUserId) {
      toast.error("You must be the portfolio owner to deploy");
      return;
    }

    if (!portfolioSlug) {
      toast.error("Please enter a portfolio slug");
      return;
    }

    if (!validatePortfolioSlug(portfolioSlug)) {
      return;
    }

    setIsDeploying(true);

    try {
      const result = await deployPortfolio(user.id, portfolioId, portfolioSlug);
      if (result.success && result.data) {
        setIsDeployed(true);
        setDeployedUrl(result.data.url);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
        toast.success("Portfolio deployed successfully!");
      } else {
        toast.error(result.error || "Failed to deploy portfolio");
      }
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Failed to deploy portfolio");
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md p-6 rounded-lg shadow-xl"
        style={{ backgroundColor: ColorTheme.bgMain }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#2c2c2e] transition-colors"
          style={{ color: ColorTheme.textPrimary }}
        >
          <X size={20} />
        </button>

        {portfolioLink ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${ColorTheme.primary}20` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: ColorTheme.primary }} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: ColorTheme.textPrimary }}>
              Portfolio Already Deployed!
            </h3>
            <p className="mb-6" style={{ color: ColorTheme.textSecondary }}>
              Your portfolio is live and accessible at:
              <br />
              <motion.a
                href={`https://craft-folio-three.vercel.app/p/${portfolioLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] font-medium hover:underline inline-block mt-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                craft-folio-three.vercel.app/p/{portfolioLink}
              </motion.a>
            </p>
            <div className="space-y-4">
              <motion.button
                className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: ColorTheme.primary,
                  color: "#000",
                  boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                }}
                whileHover={{
                  boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  window.open(`https://craft-folio-three.vercel.app/p/${portfolioLink}`, '_blank');
                }}
              >
                <Rocket className="h-4 w-4" />
                 Visit Portfolio 
              </motion.button>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium" style={{ color: ColorTheme.textSecondary }}>
                  Share your portfolio:
                </p>
                <div className="flex justify-center gap-2">
                  <motion.button
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      color: ColorTheme.textPrimary,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = `https://craft-folio-three.vercel.app/p/${portfolioLink}`;
                      const text = "Check out my portfolio!";
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                    }}
                  >
                    <Twitter className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      color: ColorTheme.textPrimary,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = `https://craft-folio-three.vercel.app/p/${portfolioLink}`;
                      const text = "Check out my portfolio!";
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                    }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      color: ColorTheme.textPrimary,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = `https://craft-folio-three.vercel.app/p/${portfolioLink}`;
                      const text = "Check out my portfolio!";
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    }}
                  >
                    <Facebook className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      color: ColorTheme.textPrimary,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = `https://craft-folio-three.vercel.app/p/${portfolioLink}`;
                      navigator.clipboard.writeText(url);
                      toast.success('Portfolio URL copied to clipboard!');
                    }}
                  >
                    <Link2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: ColorTheme.textPrimary }}
            >
              Deploy Your Portfolio
            </h2>

            {!isDeployed ? (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: ColorTheme.textPrimary }}>
                    Choose your portfolio slug
                  </label>
                  <div className="relative">
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-l-md" 
                      style={{ 
                        color: ColorTheme.primary,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderRight: '1px solid rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      craft-folio-three.vercel.app/p/
                    </div>
                    <input
                      type="text"
                      value={portfolioSlug}
                      onChange={(e) => setPortfolioSlug(e.target.value)}
                      placeholder="your-portfolio-slug"
                      className="w-full pl-[280px] pr-4 py-2 rounded-lg bg-[rgba(28,28,30,0.9)] border border-[rgba(75,85,99,0.3)] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none transition-colors"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm" style={{ color: ColorTheme.textSecondary }}>
                      Your portfolio will be available at: craft-folio-three.vercel.app/p/{portfolioSlug || 'your-portfolio-slug'}
                    </p>
                    <div className="text-xs space-y-1 my-2" style={{ color: ColorTheme.textSecondary }}>
                      <p className="font-medium">Portfolio slug requirements:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Use only lowercase letters, numbers, and hyphens</li>
                        <li>Must be between 3-30 characters</li>
                        <li>Cannot start or end with a hyphen</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <motion.button
                  className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer mt-6"
                  style={{
                    backgroundColor: ColorTheme.primary,
                    color: "#000",
                    boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                    opacity: isDeploying ? 0.7 : 1,
                    cursor: isDeploying ? "not-allowed" : "pointer"
                  }}
                  whileHover={{
                    boxShadow: isDeploying ? `0 4px 10px ${ColorTheme.primaryGlow}` : `0 6px 14px ${ColorTheme.primaryGlow}`,
                    scale: isDeploying ? 1 : 1.02,
                  }}
                  whileTap={{ scale: isDeploying ? 1 : 0.98 }}
                  onClick={handleDeploy}
                  disabled={isDeploying}
                >
                  {isDeploying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Deploy Now
                    </>
                  )}
                </motion.button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${ColorTheme.primary}20` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: ColorTheme.primary }} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: ColorTheme.textPrimary }}>
                  Portfolio Deployed Successfully!
                </h3>
                <p className="mb-6" style={{ color: ColorTheme.textSecondary }}>
                  Your portfolio is now live and accessible at:
                  <br />
                  <motion.a
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] font-medium hover:underline inline-block mt-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {deployedUrl}
                  </motion.a>
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DeployModal; 