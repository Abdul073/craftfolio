import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { updateSection } from '@/app/actions/portfolio';
import { redirect, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updatePortfolioData } from '@/slices/dataSlice';
import toast from 'react-hot-toast';
import React from 'react';
import { Textarea } from '../ui/textarea';
import { Cloud, X } from 'lucide-react';

const ContactSidebar = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const portfolioId = params.portfolioId as string;
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const contactSectionData = portfolioData?.find((section: any) => section.type === "userInfo");
  const contactData = contactSectionData?.data || {};

  const emptyContent = {
    email: "",
    linkedin: "",
    github: "",
    location: "",
    resumeLink: "",
    shortSummary: "",
    resumeFile: "",
  };

  const [content, setContent] = useState(emptyContent);
  const [isLoading, setIsLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState({});
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (contactData && Object.keys(contactData).length > 0) {
      setContent({
        email: contactData.email || "",
        linkedin: contactData.linkedin || "",
        github: contactData.github || "",
        location: contactData.location || "",
        resumeLink: contactData.resumeLink || "",
        shortSummary: contactData.shortSummary || "",
        resumeFile: contactData.resumeFile || "",
      });
      setOriginalContent(contactData);
      setIsUploaded(!!contactData.resumeFile);
    }
  }, [contactData]);

  if (!portfolioId) {
    return redirect("/choose-templates");
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      dispatch(updatePortfolioData({ sectionType: "userInfo", newData: content }));
      const result = await updateSection({ sectionName: "userInfo", portfolioId: portfolioId, sectionContent: content });
      setOriginalContent(content);
      toast.success("Contact information updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update contact information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
    );

    try {
      toast.loading("Uploading resume...", { id: "resumeUpload" });
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Upload failed", { id: "resumeUpload" });
        return;
      }

      const data = await response.json();
      setContent({...content, resumeFile: data.secure_url});
      setIsUploaded(true);
      toast.success("Resume uploaded successfully!", { id: "resumeUpload" });
    } catch (error) {
      toast.error("An error occurred during upload", { id: "resumeUpload" });
      console.error("Upload error:", error);
    }
  };

  const removeResume = () => {
    setContent({...content, resumeFile: ""});
    setIsUploaded(false);
  };

  return (
    <div className="flex-1 custom-scrollbar h-full">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Contact Information</CardTitle>
          <CardDescription className="text-gray-400">Manage your contact information.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={content.email}
              onChange={(e) => setContent({ ...content, email: e.target.value })}
              placeholder="Enter your email address"
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-sm font-medium text-gray-300">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={content.linkedin}
              onChange={(e) => setContent({ ...content, linkedin: e.target.value })}
              placeholder="Enter your LinkedIn URL"
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
            <p className="text-xs text-gray-400">e.g. https://linkedin.com/in/username</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="text-sm font-medium text-gray-300">GitHub Profile</Label>
            <Input
              id="github"
              value={content.github}
              onChange={(e) => setContent({ ...content, github: e.target.value })}
              placeholder="Enter your GitHub URL"
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
            <p className="text-xs text-gray-400">e.g. https://github.com/username</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-300">Location</Label>
            <Input
              id="location"
              value={content.location}
              onChange={(e) => setContent({ ...content, location: e.target.value })}
              placeholder="Enter your location"
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
            <p className="text-xs text-gray-400">e.g. New York, USA </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shortSummary" className="text-sm font-medium text-gray-300">Short Summary</Label>
            <Textarea
              id="shortSummary"
              value={content.shortSummary}
              onChange={(e) => setContent({ ...content, shortSummary: e.target.value })}
              placeholder="Enter a short summary about yourself"
              className="resize-none custom-scrollbar h-32 bg-gray-800 border-gray-700 text-gray-100"
            />
            <p className="text-xs text-gray-400">Use new lines to create multiple paragraphs</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resumeUpload" className="text-sm font-medium text-gray-300">Resume</Label>
            <div className="mt-1 flex flex-col items-center">
              {content.resumeFile ? (
                <div className="relative w-full">
                  <div className="flex items-center justify-between w-full p-3 bg-gray-800 border border-gray-700 rounded-md">
                    <div className="flex items-center">
                      <div className="mr-3 bg-gray-700 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <span className="text-white truncate max-w-xs">Resume.pdf</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeResume}
                      className="h-8 w-8 p-0 bg-gray-700 text-white hover:bg-gray-600 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="w-full cursor-pointer">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center h-32 hover:border-gray-400 transition-colors">
                    <Cloud className="h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-400">Upload resume</p>
                    <p className="mt-1 text-xs text-gray-500">PDF up to 10MB</p>
                    <input
                      type="file"
                      id="resumeUpload"
                      accept="application/pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </div>
                </label>
              )}
            </div>
            
            {!isUploaded && !content.resumeFile && (
              <div className="mt-2">
                <Label htmlFor="resumeLink" className="text-sm font-medium text-gray-300">Or paste resume URL</Label>
                <Input
                  id="resumeLink"
                  value={content.resumeLink}
                  onChange={(e) => setContent({ ...content, resumeLink: e.target.value })}
                  placeholder="Enter your resume link"
                  className="bg-gray-800 border-gray-700 text-gray-100 mt-2"
                />
                <p className="text-xs text-gray-400 mt-2">Link to your resume (PDF recommended)</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 pb-6">
          <div className="flex w-full space-x-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContactSidebar;