import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { updateSection } from "@/app/actions/portfolio";
import { redirect, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePortfolioData } from "@/slices/dataSlice";
import toast from "react-hot-toast";
import React from "react";
import { Textarea } from "../ui/textarea";
import { Cloud, X, Plus } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

interface SocialLink {
  href: string;
  [key: string]: string;
}

const ContactSidebar = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const portfolioId = params.portfolioId as string;
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const contactSectionData = portfolioData?.find(
    (section: any) => section.type === "userInfo"
  );
  const contactData = contactSectionData?.data || {};
  const [sectionTitle, setSectionTitle] = useState(
    contactSectionData?.sectionTitle || ""
  );
  const [sectionDescription, setSectionDescription] = useState(
    contactSectionData?.sectionDescription || ""
  );
  const [hasHeaderChanges, setHasHeaderChanges] = useState(false);

  const emptyContent = {
    socialLinks: [] as SocialLink[],
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
      const initialSocialLinks: SocialLink[] = [];

      if (contactData.email) {
        initialSocialLinks.push({
          href: `mailto:${contactData.email}`,
          email: contactData.email,
        });
      }
      if (contactData.linkedin) {
        initialSocialLinks.push({
          href: contactData.linkedin,
          linkedin: "LinkedIn",
        });
      }
      if (contactData.github) {
        initialSocialLinks.push({ href: contactData.github, github: "GitHub" });
      }
      if (contactData.location) {
        initialSocialLinks.push({
          href: contactData.location,
          location: contactData.location,
        });
      }

      // Add any other social links that might be in the socialLinks array directly
      if (contactData.socialLinks && Array.isArray(contactData.socialLinks)) {
        initialSocialLinks.push(...contactData.socialLinks);
      }

      setContent({
        socialLinks: initialSocialLinks,
        resumeLink: contactData.resumeLink || "",
        shortSummary: contactData.shortSummary || "",
        resumeFile: contactData.resumeFile || "",
      });
      setOriginalContent(contactData);
      setIsUploaded(!!contactData.resumeFile);
    } else {
      setContent(emptyContent);
      setOriginalContent({});
      setIsUploaded(false);
    }
  }, [contactData]);

  useEffect(() => {
    setHasHeaderChanges(
      sectionTitle !== (contactSectionData?.sectionTitle || "") ||
        sectionDescription !== (contactSectionData?.sectionDescription || "")
    );
  }, [sectionTitle, sectionDescription, contactSectionData]);

  if (!portfolioId) {
    return redirect("/choose-templates");
  }

  const handleSubmit = async () => {
    const originalContent = { ...content };
    const originalSectionTitle = sectionTitle;
    const originalSectionDescription = sectionDescription;

    try {
      setIsLoading(true);

      dispatch(
        updatePortfolioData({
          sectionType: "userInfo",
          newData: content,
          sectionTitle,
          sectionDescription,
        })
      );

      const result = await updateSection({
        sectionName: "userInfo",
        portfolioId: portfolioId,
        sectionContent: content,
        sectionTitle,
        sectionDescription,
      });

      if (!result.success) {
        dispatch(
          updatePortfolioData({
            sectionType: "userInfo",
            newData: originalContent,
            sectionTitle: originalSectionTitle,
            sectionDescription: originalSectionDescription,
          })
        );
        throw new Error("Database update failed");
      }

      setOriginalContent(content);
      toast.success("Contact information updated successfully");
    } catch (error) {
      console.error(error);
      setContent(originalContent);
      setSectionTitle(originalSectionTitle);
      setSectionDescription(originalSectionDescription);
      toast.error(
        "Failed to update contact information. Changes have been reverted."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      setContent({ ...content, resumeFile: data.secure_url });
      setIsUploaded(true);
      toast.success("Resume uploaded successfully!", { id: "resumeUpload" });
    } catch (error) {
      toast.error("An error occurred during upload", { id: "resumeUpload" });
      console.error("Upload error:", error);
    }
  };

  const removeResume = () => {
    setContent({ ...content, resumeFile: "" });
    setIsUploaded(false);
  };

  const handleSaveHeader = async () => {
    const originalContent = { ...content };
    const originalSectionTitle = sectionTitle;
    const originalSectionDescription = sectionDescription;

    try {
      dispatch(
        updatePortfolioData({
          sectionType: "userInfo",
          newData: content,
          sectionTitle,
          sectionDescription,
        })
      );

      const result = await updateSection({
        portfolioId: portfolioId,
        sectionName: "userInfo",
        sectionContent: content,
        sectionTitle,
        sectionDescription,
      });

      if (!result.success) {
        dispatch(
          updatePortfolioData({
            sectionType: "userInfo",
            newData: originalContent,
            sectionTitle: originalSectionTitle,
            sectionDescription: originalSectionDescription,
          })
        );
        throw new Error("Database update failed");
      }

      setHasHeaderChanges(false);
      toast.success("Section header updated successfully");
    } catch (error) {
      console.error("Error saving section header:", error);
      setContent(originalContent);
      setSectionTitle(originalSectionTitle);
      setSectionDescription(originalSectionDescription);
      toast.error(
        "Failed to update section header. Changes have been reverted."
      );
    }
  };

  const addSocialLink = () => {
    setContent({
      ...content,
      socialLinks: [...content.socialLinks, { href: "", type: "" }],
    });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newSocialLinks = [...content.socialLinks];
    newSocialLinks[index] = {
      ...newSocialLinks[index],
      [field]: value,
      href: field === "href" ? value : newSocialLinks[index].href,
    };
    setContent({ ...content, socialLinks: newSocialLinks });
  };

  const removeSocialLink = (index: number) => {
    const newSocialLinks = content.socialLinks.filter((_, i) => i !== index);
    setContent({ ...content, socialLinks: newSocialLinks });
  };

  return (
    <div className="flex-1 custom-scrollbar h-full">
      <Card
        className="min-h-screen rounded-none"
        style={{
          backgroundColor: ColorTheme.bgMain,
          borderColor: ColorTheme.borderLight,
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: ColorTheme.textPrimary }}>
            Contact Information
          </CardTitle>
          <CardDescription style={{ color: ColorTheme.textSecondary }}>
            Manage your contact information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList
              style={{
                backgroundColor: ColorTheme.bgNav,
                borderColor: ColorTheme.borderLight,
              }}
            >
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-gray-700 cursor-pointer"
                style={{ color: ColorTheme.textPrimary }}
              >
                Basic Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-4">
              <CardContent className="p-0 space-y-5">
                {contactSectionData?.sectionTitle && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="sectionTitle"
                      className="text-sm font-medium"
                      style={{ color: ColorTheme.textPrimary }}
                    >
                      Section Title
                    </Label>
                    <Input
                      id="sectionTitle"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      placeholder="Enter section title"
                      style={{
                        backgroundColor: ColorTheme.bgCard,
                        borderColor: ColorTheme.borderLight,
                        color: ColorTheme.textPrimary,
                      }}
                    />
                  </div>
                )}

                {contactSectionData?.sectionDescription && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="sectionDescription"
                      className="text-sm font-medium"
                      style={{ color: ColorTheme.textPrimary }}
                    >
                      Section Description
                    </Label>
                    <Textarea
                      id="sectionDescription"
                      value={sectionDescription}
                      onChange={(e) => setSectionDescription(e.target.value)}
                      placeholder="Enter section description"
                      className="resize-none h-20"
                      style={{
                        backgroundColor: ColorTheme.bgCard,
                        borderColor: ColorTheme.borderLight,
                        color: ColorTheme.textPrimary,
                      }}
                    />
                  </div>
                )}

                {hasHeaderChanges && (
                  <Button
                    onClick={handleSaveHeader}
                    className="w-full"
                    style={{
                      backgroundColor: ColorTheme.primary,
                      color: ColorTheme.textPrimary,
                      boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                    }}
                  >
                    Save Section Header
                  </Button>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label
                      className="text-sm font-medium"
                      style={{ color: ColorTheme.textPrimary }}
                    >
                      Social Links
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addSocialLink}
                      style={{
                        backgroundColor: ColorTheme.bgCardHover,
                        color: ColorTheme.textPrimary,
                      }}
                      className="h-8 w-8 p-0 hover:bg-opacity-50 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {content.socialLinks.map((link, index) => (
                    <div key={index} className="space-y-4 border p-4 rounded-md"
                         style={{ borderColor: ColorTheme.borderLight }}>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`social-link-url-${index}`}
                          className="text-sm font-medium"
                          style={{ color: ColorTheme.textPrimary }}
                        >
                          URL
                        </Label>
                        <Input
                          id={`social-link-url-${index}`}
                          value={link.href}
                          onChange={(e) =>
                            updateSocialLink(index, "href", e.target.value)
                          }
                          placeholder="Enter social media URL"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary,
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`social-link-label-${index}`}
                          className="text-sm font-medium"
                          style={{ color: ColorTheme.textPrimary }}
                        >
                          Label
                        </Label>
                        <Input
                          id={`social-link-label-${index}`}
                          value={Object.entries(link)
                            .filter(([key]) => key !== "href")[0]?.[1] || ""}
                          onChange={(e) =>
                            updateSocialLink(
                              index,
                              Object.keys(link).find((key) => key !== "href") ||
                                "type",
                              e.target.value
                            )
                          }
                          placeholder="Enter label (e.g., LinkedIn, GitHub)"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary,
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                        style={{
                          backgroundColor: ColorTheme.primary,
                          color: ColorTheme.textPrimary,
                          boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                        }}
                        className="w-full mt-4"
                      >
                        Remove Social Link
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="resumeUpload"
                    className="text-sm font-medium"
                    style={{ color: ColorTheme.textPrimary }}
                  >
                    Resume
                  </Label>
                  <div className="mt-1 flex flex-col items-center">
                    {content.resumeFile ? (
                      <div className="relative w-full">
                        <div
                          className="flex items-center justify-between w-full p-3 rounded-md"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                          }}
                        >
                          <div className="flex items-center">
                            <div
                              className="mr-3 p-2 rounded"
                              style={{
                                backgroundColor: ColorTheme.bgCardHover,
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: ColorTheme.textPrimary }}
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </div>
                            <span
                              style={{ color: ColorTheme.textPrimary }}
                              className="truncate max-w-xs"
                            >
                              Resume.pdf
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeResume}
                            style={{
                              backgroundColor: ColorTheme.bgCardHover,
                              color: ColorTheme.textPrimary,
                            }}
                            className="h-8 w-8 p-0 hover:bg-opacity-50 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full cursor-pointer">
                        <div
                          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-32 hover:border-opacity-50 transition-colors"
                          style={{
                            borderColor: ColorTheme.borderLight,
                          }}
                        >
                          <Cloud
                            className="h-8 w-8"
                            style={{ color: ColorTheme.textSecondary }}
                          />
                          <p
                            className="mt-2 text-sm"
                            style={{ color: ColorTheme.textSecondary }}
                          >
                            Upload resume
                          </p>
                          <p
                            className="mt-1 text-xs"
                            style={{ color: ColorTheme.textMuted }}
                          >
                            PDF up to 10MB
                          </p>
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
                      <Label
                        htmlFor="resumeLink"
                        className="text-sm font-medium"
                        style={{ color: ColorTheme.textPrimary }}
                      >
                        Or paste resume URL
                      </Label>
                      <Input
                        id="resumeLink"
                        value={content.resumeLink}
                        onChange={(e) =>
                          setContent({ ...content, resumeLink: e.target.value })
                        }
                        placeholder="Enter your resume link"
                        style={{
                          backgroundColor: ColorTheme.bgCard,
                          borderColor: ColorTheme.borderLight,
                          color: ColorTheme.textPrimary,
                        }}
                        className="mt-2"
                      />
                      <p
                        className="text-xs mt-2"
                        style={{ color: ColorTheme.textSecondary }}
                      >
                        Link to your resume (PDF recommended)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="pt-4 pb-6">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              backgroundColor: ColorTheme.primary,
              color: ColorTheme.textPrimary,
              boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
            }}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContactSidebar;
