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
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import React from 'react';

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
    github: ""
  };

  const [content, setContent] = useState(emptyContent);
  const [isLoading, setIsLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState({});

  useEffect(() => {
    if (contactData && Object.keys(contactData).length > 0) {
      setContent({
        email: contactData.email || "",
        linkedin: contactData.linkedin || "",
        github: contactData.github || ""
      });
      setOriginalContent(contactData);
    }
  }, [contactData]);


  if (!portfolioId) {
    return redirect("/choose-templates");
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      dispatch(updatePortfolioData({ sectionType: "userInfo", newData: content }));
      const result = await updateSection({ sectionName : "userInfo", portfolioId: portfolioId, sectionContent: content });
      setOriginalContent(content);
      toast.success("Contact information updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update contact information");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(content)

  return (
    <div className="flex-1 custom-scrollbar h-full">
      <Card className='h-screen'>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage your contact information.</CardDescription>
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
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-sm font-medium text-gray-300">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={content.linkedin}
              onChange={(e) => setContent({ ...content, linkedin: e.target.value })}
              placeholder="Enter your LinkedIn URL"
              className="bg-gray-800 border-gray-700 text-white"
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
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">e.g. https://github.com/username</p>
          </div>
        </CardContent>

        <CardFooter className="pt-4 pb-6">
          <div className="flex w-full space-x-2">
            
            <Button
              className={"w-full"}
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