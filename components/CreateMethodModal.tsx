// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { GripHorizontalIcon, MousePointer2, CheckCircle, FileText, PlusCircle } from 'lucide-react';
// import { useUser } from '@clerk/nextjs';
// import toast from 'react-hot-toast';
// import { setPortfolioData } from '@/slices/dataSlice';
// import { useDispatch } from 'react-redux';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { motion } from 'framer-motion';

// const CreateMethodModal = ({ isModalOpen, setIsModalOpen } : { isModalOpen: boolean, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
//     const [creationMethod, setCreationMethod] = useState("");
//     const [isCreating, setIsCreating] = useState(false);


//     const staggerContainer = {
//         hidden: { opacity: 0 },
//         visible: {
//           opacity: 1,
//           transition: {
//             staggerChildren: 0.2
//           }
//         }
//       };

//       const fadeInScale = {
//         hidden: { opacity: 0, scale: 0.9 },
//         visible: { 
//           opacity: 1, 
//           scale: 1,
//           transition: { 
//             duration: 0.6,
//             ease: "easeOut"
//           }
//         }
//       };

//       const [themes] = useState([
//         {
//           id: 1,
//           name: 'NeoSpark',
//           description: 'A minimalist theme with a responsive layout, dark/light mode support and smooth transitions',
//           image: '/portfolio.png',
//           category: 'minimalist',
//         },
//         {
//           id: 2,
//           name: 'Palette',
//           description: 'A modern theme featuring a responsive design, profile photo option, sleek aesthetics and skill badges',
//           image: '/portfolio.png',
//           category: 'creative',
//         },
//         {
//           id: 3,
//           name: 'Pinnacle',
//           description: 'An interactive theme with a modern interface, skills and category sections and dark/light mode support',
//           image: '/portfolio.png',
//           category: 'professional',
//         },
//         {
//           id: 4,
//           name: 'Classic',
//           description: 'A professional theme with traditional layout, perfect for corporate portfolios',
//           image: '/portfolio.png',
//           category: 'business',
//         },
//         {
//           id: 5,
//           name: 'Creative',
//           description: 'An artistic theme with unique animations and layout options for creative professionals',
//           image: '/portfolio.png',
//           category: 'creative',
//         },
//         {
//           id: 6,
//           name: 'Developer',
//           description: 'A tech-focused theme with code snippet displays and GitHub integration',
//           image: '/portfolio.png',
//           category: 'portfolio',
//         },
//       ]);

//       const handleCreatePortfolio = async () => {
//         if (selectedTheme && user && creationMethod) {
//           setIsCreating(true);
//           try {
//             const themeName = themes.find((theme) => theme.id === selectedTheme)?.name;
//             if(!themeName){
//               toast.error("Invalid template");
//               return;
//             }
            
//             const result = await createPortfolio(user.id, themeName, creationMethod);
            
//             if (result.success) {
//               toast.success('Portfolio created successfully');
//               if (creationMethod === 'import') {
//                 router.push(`/portfolio/${result?.data?.id}/import-resume`);
//               } else {
//                 router.push(`/portfolio/${result?.data?.id}`);
//               }
//             } else {
//               toast.error('Failed to create portfolio');
//               console.error("Failed to create portfolio:", result.error);
//             }
//           } catch (error) {
//             console.error("Error creating portfolio:", error);
//             toast.error('An error occurred');
//           } finally {
//             setIsCreating(false);
//             setIsModalOpen(false);
//           }
//         }
//       };

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//   <DialogContent 
//     className="backdrop-blur-xl rounded-xl overflow-hidden"
//     style={{ 
//       backgroundColor: 'rgba(18, 18, 18, 0.95)', 
//       border: '1px solid rgba(75, 85, 99, 0.3)',
//       color: '#f3f4f6',
//       boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 10px 30px rgba(16, 185, 129, 0.15)',
//       maxWidth: '900px',
//       padding: '48px',
//     }}
//   >
//     <DialogHeader className="mb-4">
//       <DialogTitle>
//               <h2 className="text-3xl text-center md:text-4xl font-bold">
//               How would you like to build your <span style={{ 
//                   background: `linear-gradient(to right, #10b981, #047857)`,
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent"
//                 }}>portfolio</span>?
//         </h2>
//       </DialogTitle>
//     </DialogHeader>
    
//     <motion.div 
//       className="flex flex-col md:flex-row gap-6 mt-6"
//       initial="hidden"
//       animate="visible"
//       variants={staggerContainer}
//     >
//       {/* From scratch option */}
//       <motion.div 
//         className="flex-1 p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center"
//         variants={fadeInScale}
//         style={{ 
//           backgroundColor: creationMethod === 'scratch' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(28, 28, 30, 0.8)',
//           borderColor: creationMethod === 'scratch' ? '#10b981' : 'rgba(75, 85, 99, 0.3)',
//           boxShadow: creationMethod === 'scratch' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
//         }}
//         whileHover={{ 
//           borderColor: '#10b981',
//           boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2)'
//         }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => setCreationMethod('scratch')}
//       >
//         <div className="p-3 rounded-full mb-4" style={{ 
//           background: creationMethod === 'scratch' 
//             ? '#10b981' 
//             : 'rgba(38, 38, 42, 0.8)'
//         }}>
//           <PlusCircle className="h-7 w-7" style={{ color: creationMethod === 'scratch' ? '#000' : '#f3f4f6' }} />
//         </div>
//         <h3 className="text-xl font-semibold" style={{ color: '#f3f4f6' }}>Create from Scratch</h3>
//         <p className=''>Start with a blank template and build your portfolio step by step. Perfect if you want complete control over your content.</p>
//       </motion.div>
      
//       {/* Import from resume option */}
//       <motion.div 
//         className="flex-1 p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center"
//         variants={fadeInScale}
//         style={{ 
//           backgroundColor: creationMethod === 'import' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(28, 28, 30, 0.8)',
//           borderColor: creationMethod === 'import' ? '#10b981' : 'rgba(75, 85, 99, 0.3)',
//           boxShadow: creationMethod === 'import' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
//         }}
//         whileHover={{ 
//           borderColor: '#10b981',
//           boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2)'
//         }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => setCreationMethod('import')}
//       >
//         <div className="p-3 rounded-full mb-4" style={{ 
//           background: creationMethod === 'import' 
//             ? '#10b981' 
//             : 'rgba(38, 38, 42, 0.8)'
//         }}>
//           <FileText className="h-7 w-7" style={{ color: creationMethod === 'import' ? '#000' : '#f3f4f6' }} />
//         </div>
//         <h3 className="text-xl font-semibold" style={{ color: '#f3f4f6' }}>Import from Resume</h3>
//         <p> Upload your existing resume and we'll automatically populate your portfolio. Save time by importing your skills, experience, projects and education.</p>
//       </motion.div>
//     </motion.div>
    
//     <motion.div 
//       className="flex justify-center mt-8"
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.4 }}
//     >
//       <motion.button 
//         className="px-8 py-3 rounded-lg font-medium text-lg transition-all flex items-center justify-center"
//         style={{ 
//           background: creationMethod 
//             ? '#10b981' 
//             : 'rgba(38, 38, 42, 0.8)',
//           color: creationMethod ? '#000' : '#9ca3af',
//           boxShadow: creationMethod ? '0 6px 20px rgba(16, 185, 129, 0.15)' : 'none',
//           cursor: creationMethod && !isCreating ? 'pointer' : 'not-allowed',
//           opacity: isCreating ? 0.7 : 1,
//           width: '170px'
//         }}
//         whileHover={{ 
//           boxShadow: creationMethod && !isCreating ? '0 8px 24px rgba(16, 185, 129, 0.2)' : 'none',
//           scale: creationMethod && !isCreating ? 1.03 : 1
//         }}
//         whileTap={{ scale: creationMethod && !isCreating ? 0.97 : 1 }}
//         onClick={handleCreatePortfolio}
//         disabled={isCreating || !creationMethod}
//       >
//         {isCreating ? (
//           <>
//             <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             <span>Creating...</span>
//           </>
//         ) : (
//           <>Get Started</>
//         )}
//       </motion.button>
//     </motion.div>
//   </DialogContent>
// </Dialog>
//   )
// }

// export default CreateMethodModal