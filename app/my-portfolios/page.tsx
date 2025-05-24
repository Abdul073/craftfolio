"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchPortfoliosByUserId, deployPortfolio } from "../actions/portfolio";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/MainNavbar";
import LoadingSpinner, { LoadingMessage } from "@/components/LoadingSpinner";
import { Palette, Layout, CheckCircle, Rocket, X } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function MyPortfoliosPage() {
  const { user } = useUser();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [portfolioSlug, setPortfolioSlug] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInputPopup, setShowInputPopup] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      fetchPortfoliosByUserId(user.id)
        .then((res) => {
          if (res.success) {
            setPortfolios(res.data || []);
            setError(null);
          } else {
            setError(res.error || "Failed to fetch portfolios");
          }
        })
        .catch(() => setError("Failed to fetch portfolios"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  console.log(portfolios)

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
    if (!portfolioSlug) {
      toast.error("Please enter a portfolio slug");
      return;
    }
    if (!validatePortfolioSlug(portfolioSlug)) {
      return;
    }

    setIsDeploying(true);
    try {
      const result = await deployPortfolio(user?.id || "", selectedPortfolioId, portfolioSlug);
      if (result.success && result.data) {
        setIsDeployed(true);
        setDeployedUrl(result.data.url);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      } else {
        toast.error(result.error || "Failed to deploy portfolio");
      }
    } catch (error) {
      toast.error("An error occurred while deploying");
    } finally {
      setIsDeploying(false);
    }
  };

  if (user === undefined || loading) {
    const myPortfoliosMessages: LoadingMessage[] = [
      { text: "Loading your portfolios", icon: Palette },
      { text: "Fetching data", icon: Layout },
      { text: "Almost there", icon: CheckCircle },
    ];
    return <LoadingSpinner loadingMessages={myPortfoliosMessages} />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="main-bg-noise">
      <MainNavbar />
      <div
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 50%)`,
        }}
        className="flex flex-col items-center justify-center min-h-screen pt-24 w-full px-2 sm:px-4"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 text-center font-bold">
          My Portfolios
        </h1>
        {portfolios.length === 0 ? (
          <div>No portfolios found.</div>
        ) : (
          <ul className="w-full max-w-full sm:max-w-2xl space-y-3 sm:space-y-4">
            {portfolios.map((portfolio) => (
              <li
                key={portfolio.id}
                className="border rounded-xl p-3 sm:p-4 flex justify-between items-center bg-[var(--bg-card)] shadow-sm transition-all duration-200 hover:shadow-lg"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() => router.push(`/p/${portfolio.id}`)}
                >
                  <span
                    className="font-semibold text-base sm:text-lg transition-colors"
                    style={{ color: "inherit" }}
                  >
                    Template:{" "}
                    <span className="transition-colors group-hover:text-[var(--primary)]">
                      {portfolio.templateName}
                    </span>
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    Created:{" "}
                    {portfolio.createdAt
                      ? new Date(portfolio.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                  {portfolio.PortfolioLinks && portfolio.PortfolioLinks.length > 0 && (
                    <span className="text-green-500 text-xs sm:text-sm mt-1">
                      Deployed at:{" "}
                      <a 
                        href={`https://craft-folio-three-vercel.app/p/${portfolio.PortfolioLinks[0].slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        craft-folio-three-vercel.app/p/{portfolio.PortfolioLinks[0].slug}
                      </a>
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  {portfolio.PortfolioLinks && portfolio.PortfolioLinks.length > 0 ? (
                    <motion.div
                      className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        color: ColorTheme.primary,
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Deployed
                    </motion.div>
                  ) : (
                    <Dialog
                      open={isDeployModalOpen}
                      onOpenChange={(open) => {
                        setIsDeployModalOpen(open);
                        if (open) {
                          setSelectedPortfolioId(portfolio.id);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <motion.button
                          className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium flex items-center gap-2"
                          style={{
                            backgroundColor: ColorTheme.primary,
                            color: "#000",
                            boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                          }}
                          whileHover={{
                            boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                          }}
                        >
                          <Rocket className="h-4 w-4" />
                          Deploy
                        </motion.button>
                      </DialogTrigger>
                      <DialogContent
                        className="backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-[95vw] p-6 sm:max-w-lg"
                        style={{
                          backgroundColor: "rgba(18, 18, 18, 0.95)",
                          border: "1px solid rgba(75, 85, 99, 0.3)",
                          color: "#f3f4f6",
                          boxShadow:
                            "0 25px 50px rgba(0,0,0,0.3), 0 10px 30px rgba(16, 185, 129, 0.15)",
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-center">
                            Deploy Your Portfolio
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-6">
                          {!isDeployed ? (
                            <>
                              <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">
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
                                    craft-folio-three-vercel.app/p/
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
                                  <p className="text-sm text-gray-400">
                                    Your portfolio will be available at: craft-folio-three-vercel.app/p/{portfolioSlug || 'your-portfolio-slug'}
                                  </p>
                                  <div className="text-xs text-gray-500 space-y-1 my-2">
                                    <p className="font-medium text-gray-400">Portfolio slug requirements:</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                      <li>Use only lowercase letters, numbers, and hyphens</li>
                                      <li>Must be between 3-30 characters</li>
                                      <li>Cannot start or end with a hyphen</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <motion.button
                                className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer"
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
                              <p className="text-gray-400 mb-6">
                                Your portfolio is now live and accessible at:
                                <br />
                                <span className="text-[var(--primary)] font-medium">
                                  {deployedUrl}
                                </span>
                              </p>
                              <motion.a
                                href={deployedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 rounded-lg font-medium cursor-pointer"
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
                              >
                                Visit Portfolio
                              </motion.a>
                            </motion.div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <style jsx>{`
                  li:hover {
                    background: var(--bg-card-hover);
                    border-color: var(--primary);
                  }
                  li:hover span {
                    color: var(--primary);
                  }
                `}</style>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showConfetti && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999999,
            pointerEvents: "none",
          }}
        >
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={800}
            gravity={0.15}
            tweenDuration={10000}
            initialVelocityY={10}
            colors={[
              "#f44336",
              "#e91e63",
              "#9c27b0",
              "#673ab7",
              "#3f51b5",
              "#2196f3",
              "#03a9f4",
              "#00bcd4",
              "#009688",
              "#4CAF50",
              "#8BC34A",
              "#FFEB3B",
              "#FFC107",
              "#FF9800",
              "#FF5722",
            ]}
          />
        </div>
      )}
    </div>
  );
}
