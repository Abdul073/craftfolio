import { motion } from "framer-motion";
import { FileText, PlusCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import {
    Dialog,
    DialogContent, DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { fadeInScale, staggerContainer } from '@/lib/animations';
import { useState } from 'react';

const CreateMethodModal = ({ isModalOpen, setIsModalOpen, isCreating, setCreationMethod, creationMethod, handleCreatePortfolio }: { isModalOpen: boolean, isCreating: boolean, setIsModalOpen: (isOpen: boolean) => void, setCreationMethod: (creationMethod: string) => void, creationMethod: string, handleCreatePortfolio: () => void }) => {
    const [showResumeImport, setShowResumeImport] = useState(false);
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    
    const handleResumeUpload = (e : any) => {
        if (e.target.files.length > 0) {
            setResumeUploaded(true);
            // Simulate analysis delay
            setTimeout(() => {
                setShowPreview(true);
            }, 2000);
        }
    };
    
    const handleMethodSelect = (method : string) => {
        setCreationMethod(method);
    };
    
    const handleButtonClick = () => {
        if (creationMethod === 'scratch') {
            handleCreatePortfolio();
        } else if (creationMethod === 'import') {
            setShowResumeImport(true);
        }
    };
    
    const handleBackButton = () => {
        setShowResumeImport(false);
        setResumeUploaded(false);
        setShowPreview(false);
    };

    const pulseAnimation = {
        scale: [1, 1.02, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
        }
    };

    const ColorTheme = {
        primary: '#10b981',
        primaryDark: '#047857',
        primaryGlow: 'rgba(16, 185, 129, 0.15)',
        bgCard: 'rgba(28, 28, 30, 0.9)',
        borderLight: 'rgba(75, 85, 99, 0.3)',
        textPrimary: '#f3f4f6',
        textSecondary: '#d1d5db',
        textMuted: '#9ca3af'
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent
                className="backdrop-blur-xl rounded-xl overflow-hidden"
                style={{
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    color: '#f3f4f6',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 10px 30px rgba(16, 185, 129, 0.15)',
                    maxWidth: '900px',
                    padding: '48px',
                }}
            >
                {!showResumeImport ? (
                    <>
                        <DialogHeader className="mb-4">
                            <DialogTitle className='text-3xl text-center md:text-4xl font-bold'>
                                How would you like to build your <span style={{
                                    background: `linear-gradient(to right, #10b981, #047857)`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>portfolio</span>?
                            </DialogTitle>
                            <p className="text-center text-gray-400 mt-2">Choose the method that works best for you to get started quickly</p>
                        </DialogHeader>

                        <motion.div
                            className="flex flex-col md:flex-row gap-6 mt-6"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            {/* From scratch option */}
                            <motion.div
                                className="flex-1 p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center"
                                variants={fadeInScale}
                                style={{
                                    backgroundColor: creationMethod === 'scratch' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(28, 28, 30, 0.8)',
                                    borderColor: creationMethod === 'scratch' ? '#10b981' : 'rgba(75, 85, 99, 0.3)',
                                    boxShadow: creationMethod === 'scratch' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
                                }}
                                whileHover={{
                                    borderColor: '#10b981',
                                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleMethodSelect('scratch')}
                            >
                                <div className="p-3 rounded-full mb-4" style={{
                                    background: creationMethod === 'scratch'
                                        ? '#10b981'
                                        : 'rgba(38, 38, 42, 0.8)'
                                }}>
                                    <PlusCircle className="h-7 w-7" style={{ color: creationMethod === 'scratch' ? '#000' : '#f3f4f6' }} />
                                </div>
                                <h3 className="text-xl font-semibold" style={{ color: '#f3f4f6' }}>Edit a Pre-filled Template</h3>
                                <p className='text-gray-400'>
                                Start with a pre-filled template featuring dummy data that you can easily edit. Perfect for building your portfolio step by step while maintaining full control over the content                                    </p>
                            </motion.div>

                            {/* Import from resume option */}
                            <motion.div
                                className="flex-1 p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center"
                                variants={fadeInScale}
                                style={{
                                    backgroundColor: creationMethod === 'import' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(28, 28, 30, 0.8)',
                                    borderColor: creationMethod === 'import' ? '#10b981' : 'rgba(75, 85, 99, 0.3)',
                                    boxShadow: creationMethod === 'import' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
                                }}
                                whileHover={{
                                    borderColor: '#10b981',
                                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleMethodSelect('import')}
                            >
                                <div className="p-3 rounded-full mb-4" style={{
                                    background: creationMethod === 'import'
                                        ? '#10b981'
                                        : 'rgba(38, 38, 42, 0.8)'
                                }}>
                                    <FileText className="h-7 w-7" style={{ color: creationMethod === 'import' ? '#000' : '#f3f4f6' }} />
                                </div>
                                <h3 className="text-xl font-semibold" style={{ color: '#f3f4f6' }}>Import from Resume</h3>
                                <p className="text-gray-400">Upload your existing resume and we'll automatically populate your portfolio. Save time by importing your skills, experience, projects and education.</p>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="flex justify-center mt-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {creationMethod && (
                                <motion.button
                                    className="px-8 py-3 rounded-lg font-medium text-lg group transition-all flex items-center  justify-center"
                                    style={{
                                        background: '#10b981',
                                        color: '#000',
                                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.15)',
                                        cursor: !isCreating ? 'pointer' : 'not-allowed',
                                        opacity: isCreating ? 0.7 : 1,
                                    }}
                                    whileHover={{
                                        boxShadow: !isCreating ? '0 8px 24px rgba(16, 185, 129, 0.2)' : 'none',
                                    }}
                                    whileTap={{ scale: !isCreating ? 0.97 : 1 }}
                                    onClick={handleButtonClick}
                                    disabled={isCreating}
                                >
                                    {isCreating ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <div className="flex items-center">
                                            <span>{creationMethod === 'scratch' ? 'Start Building' : 'Import Resume'}</span>
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:ml-5 transition-all duration-300 ease" />
                                        </div>
                                    )}
                                </motion.button>
                            )}
                        </motion.div>
                    </>
                ) : (
                    <div className="py-4 relative overflow-hidden">
                        {/* Back button */}
                        <motion.button
                            className="absolute top-0 left-0 flex items-center text-gray-400 hover:text-white transition-colors"
                            onClick={handleBackButton}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to options
                        </motion.button>
                        
                        {/* Background decoration */}
                        <motion.div 
                            className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full opacity-10 -z-10" 
                            style={{ background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)` }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.1, 0.15, 0.1],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        />
                        
                        <div className="mt-10">
                            <motion.div 
                                className="text-center mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.span 
                                    className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                                    style={{ 
                                        color: ColorTheme.primary,
                                        backgroundColor: ColorTheme.primaryGlow,
                                    }}
                                >
                                    Revolutionary Feature
                                </motion.span>
                                
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    The <span style={{ 
                                        background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}>Magic</span> of Resume Import
                                </h2>
                                <p 
                                    className=" max-w-3xl mx-auto"
                                    style={{ color: ColorTheme.textSecondary }}
                                >
                                    Transform your existing resume into a stunning portfolio website with just one click
                                </p>
                            </motion.div>

                            <motion.div 
                                className="max-w-lg mx-auto"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {/* Import Demo */}
                                <motion.div 
                                    className="rounded-xl overflow-hidden p-8"
                                    style={{ 
                                        backgroundColor: ColorTheme.bgCard,
                                        borderColor: ColorTheme.borderLight,
                                        backdropFilter: 'blur(16px)',
                                        boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 6px 12px ${ColorTheme.primaryGlow}`
                                    }}
                                    whileHover={{ 
                                        boxShadow: `0 15px 40px rgba(0,0,0,0.4), 0 8px 20px ${ColorTheme.primaryGlow}`,
                                        y: -5
                                    }}
                                >
                                    <div className="text-center mb-4">
                                        <h3 className="text-2xl font-semibold mb-4">Upload Your Resume</h3>
                                        <p style={{ color: ColorTheme.textSecondary }} className="mb-6">Your portfolio will be automatically created from your resume</p>
                                        
                                        <div className="relative">
                                            {!resumeUploaded ? (
                                                <motion.div 
                                                    className="border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer"
                                                    style={{ borderColor: ColorTheme.borderLight }}
                                                    whileHover={{ 
                                                        borderColor: ColorTheme.primary,
                                                        backgroundColor: 'rgba(16, 185, 129, 0.05)'
                                                    }}
                                                    animate={pulseAnimation}
                                                >
                                                    <input 
                                                        type="file" 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                                        onChange={handleResumeUpload}
                                                    />
                                                    <svg className="w-12 h-12 mx-auto mb-4" style={{ color: ColorTheme.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p style={{ color: ColorTheme.textSecondary }}>Drag & drop your resume here or click to browse</p>
                                                    <p style={{ color: ColorTheme.textMuted }} className="text-sm mt-2">Supports only PDF.</p>
                                                </motion.div>
                                            ) : (
                                                <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(28, 28, 30, 0.9)' }}>
                                                    {!showPreview ? (
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ 
                                                                borderColor: ColorTheme.primary,
                                                                borderTopColor: 'transparent'
                                                            }}></div>
                                                            <p style={{ color: ColorTheme.textSecondary }}>Analyzing your resume...</p>
                                                            <p style={{ color: ColorTheme.textMuted }} className="text-sm mt-2">This will just take a moment</p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <motion.div 
                                                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                                                style={{ backgroundColor: `${ColorTheme.primary}20` }}
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", duration: 0.6 }}
                                                            >
                                                                <svg className="w-8 h-8" style={{ color: ColorTheme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </motion.div>
                                                            <p style={{ color: ColorTheme.textSecondary }} className="mb-4">Your portfolio is ready!</p>
                                                            <motion.div 
                                                                className="rounded-lg overflow-hidden mb-4"
                                                                initial={{ y: 20, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.2 }}
                                                            >
                                                                <img src="/api/placeholder/400/300" alt="Portfolio Preview" className="w-full h-auto" />
                                                            </motion.div>
                                                            <motion.div 
                                                                className="flex justify-center gap-4"
                                                                initial={{ y: 20, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.4 }}
                                                            >
                                                                <motion.button 
                                                                    className="px-4 py-2 rounded-lg"
                                                                    style={{ 
                                                                        backgroundColor: ColorTheme.primary,
                                                                        color: ColorTheme.textPrimary,
                                                                        boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`
                                                                    }}
                                                                    whileHover={{ 
                                                                        boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`
                                                                    }}
                                                                    onClick={handleCreatePortfolio}
                                                                >
                                                                    View Portfolio
                                                                </motion.button>
                                                                <motion.button 
                                                                    className="px-4 py-2 rounded-lg"
                                                                    style={{ 
                                                                        backgroundColor: 'rgba(38, 38, 42, 0.9)',
                                                                        color: ColorTheme.textPrimary
                                                                    }}
                                                                    whileHover={{ 
                                                                        backgroundColor: 'rgba(48, 48, 52, 0.9)'
                                                                    }}
                                                                >
                                                                    Customize
                                                                </motion.button>
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Create Portfolio Button */}
                                {!resumeUploaded && (
                                    <motion.div 
                                        className="mt-8 flex justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <motion.button 
                                            className="inline-flex items-center cursor-pointer group gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                                            style={{ 
                                                background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                                color: ColorTheme.textPrimary,
                                                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                                            }}
                                            whileHover={{ 
                                                boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`
                                            }}
                                            onClick={handleCreatePortfolio}
                                            disabled={isCreating}
                                        >
                                            {isCreating ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Creating Portfolio...</span>
                                                </>
                                            ) : (
                                                <>
                                                    Create Portfolio
                                                    <ArrowRight className="h-5 w-5 ml-2 group-hover:ml-5    transition-all duration-300 ease" />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CreateMethodModal