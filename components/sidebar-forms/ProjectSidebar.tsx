import { RootState } from '@/store/store'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, X, Edit, Trash, Upload, Cloud } from 'lucide-react'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateProjects } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'

const ProjectSidebar = () => {
  interface Project {
    id: number;
    projectTitle?: string;
    projectName?: string;
    projectDescription?: string;
    projectImage?: string;
    techStack?: string[];
    githubLink?: string;
    liveLink?: string;
    year?: string;
  }
  
  const emptyProject: Project = {
    id: Date.now(),
    projectName: "",
    projectTitle: "",
    projectDescription: "",
    projectImage: "",
    techStack: [],
    githubLink: "",
    liveLink: "",
    year: ""
  }

  const { portfolioData } = useSelector((state: RootState) => state.data)
  const projectsData = portfolioData?.find((item: any) => item.type === "projects")?.data || [];
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>(emptyProject);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [techInput, setTechInput] = useState<string>("");
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const dispatch = useDispatch();

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  useEffect(() => {
    // Reset isUploaded when starting to edit a new project
    if (currentProject.projectImage === "") {
      setIsUploaded(false);
    }
  }, [currentProject.projectImage]);

  const addTechStack = () => {
    if (techInput.trim()) {
      setCurrentProject({
        ...currentProject,
        techStack: [...(currentProject.techStack || []), techInput.trim()]
      });
      setTechInput("");
    }
  }

  const removeTechItem = (index: number) => {
    const updatedTechStack = [...(currentProject.techStack || [])];
    updatedTechStack.splice(index, 1);
    setCurrentProject({
      ...currentProject,
      techStack: updatedTechStack
    });
  }

  const handleSaveProject = async() => {
    if (editingIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = currentProject;
      dispatch(updatePortfolioData({ sectionType: "projects", newData: updatedProjects }));
      await updateProjects({ portfolioId: portfolioId, projects: updatedProjects });
      setProjects(updatedProjects);
      setEditingIndex(null);
    } else {
     const updatedProjects = [...projects, currentProject];
      dispatch(updatePortfolioData({ sectionType: "projects", newData: updatedProjects }));
      await updateProjects({ portfolioId: portfolioId, projects: updatedProjects });
      setProjects(updatedProjects);
    }
    setCurrentProject(emptyProject);
    setIsUploaded(false);
  }

  const editProject = (index: number) => {
    const projectToEdit = projects[index];
    setCurrentProject(projectToEdit);
    // Check if the image is from Cloudinary
    setIsUploaded(projectToEdit.projectImage?.includes('cloudinary.com') || false);
    setEditingIndex(index);
  }

  const deleteProject = async(index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    dispatch(updatePortfolioData({ sectionType: "projects", newData: updatedProjects }));
    await updateProjects({ portfolioId: portfolioId, projects: updatedProjects });
    setProjects(updatedProjects);
  }

  const handleImageUpload = async(event: React.ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files) return
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
    );

    try {
      toast.loading("Uploading image...", { id: "imageUpload" });
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Upload failed", { id: "imageUpload" });
        return;
      }

      const data = await response.json();
      setCurrentProject({...currentProject, projectImage: data.secure_url});
      setIsUploaded(true);
      toast.success("Image uploaded successfully!", { id: "imageUpload" });
    } catch (error) {
      toast.error("An error occurred during upload", { id: "imageUpload" });
      console.error("Upload error:", error);
    }
  }

  const removeImage = () => {
    setCurrentProject({...currentProject, projectImage: ""});
    setIsUploaded(false);
  }

  return (
    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-stone-600 scrollbar-track-transparent">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your portfolio projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-300">Project Name</Label>
              <Input 
                id="projectName" 
                value={currentProject.projectName || ""} 
                onChange={(e) => setCurrentProject({...currentProject, projectName: e.target.value})} 
                placeholder="Enter project name" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectTitle" className="text-sm font-medium text-gray-300">Project Title</Label>
              <Input 
                id="projectTitle" 
                value={currentProject.projectTitle || ""} 
                onChange={(e) => setCurrentProject({...currentProject, projectTitle: e.target.value})} 
                placeholder="Project title" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-sm font-medium text-gray-300">Project Description</Label>
              <Textarea 
                id="projectDescription" 
                value={currentProject.projectDescription || ""} 
                onChange={(e) => setCurrentProject({...currentProject, projectDescription: e.target.value})} 
                placeholder="Enter project description" 
                className="resize-none h-32 bg-gray-800 border-gray-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Project Image</Label>
              
              <div className="mt-1 flex flex-col items-center">
                {currentProject.projectImage ? (
                  <div className="relative w-full">
                    <img 
                      src={currentProject.projectImage} 
                      alt="Project Preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-800 bg-opacity-70 text-white hover:bg-gray-700 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center h-48 hover:border-gray-400 transition-colors">
                      <Cloud className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-400">Upload project image</p>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      <input
                        type="file"
                        id="projectImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                )}
              </div>
              
              {/* Only show the URL input field if image is not uploaded from device */}
              {!isUploaded && !currentProject.projectImage && (
                <div className="mt-2">
                  <Label htmlFor="projectImageUrl" className="text-sm font-medium text-gray-300">Or paste image URL</Label>
                  <Input 
                    id="projectImageUrl" 
                    value={currentProject.projectImage || ""} 
                    onChange={(e) => setCurrentProject({...currentProject, projectImage: e.target.value})} 
                    placeholder="Enter image URL" 
                    className="bg-gray-800 border-gray-700 text-white mt-1" 
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col justify-between items-start">
                <Label className="text-sm font-medium text-gray-300">Tech Stack</Label>
                <div className="flex gap-2">
                  <Input 
                    value={techInput} 
                    onChange={(e) => setTechInput(e.target.value)} 
                    placeholder="Add technology" 
                    className="bg-gray-800 border-gray-700 text-white w-48" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addTechStack}
                    className="h-9 bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              
              {currentProject.techStack && currentProject.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentProject.techStack.map((tech, index) => (
                    <div key={index} className="flex items-center bg-gray-700 rounded-md px-2 py-1">
                      <span className="text-sm text-white mr-1">{tech}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTechItem(index)}
                        className="h-5 w-5 p-0 ml-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubLink" className="text-sm font-medium text-gray-300">GitHub Link</Label>
              <Input 
                id="githubLink" 
                value={currentProject.githubLink || ""} 
                onChange={(e) => setCurrentProject({...currentProject, githubLink: e.target.value})} 
                placeholder="Enter GitHub URL" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveLink" className="text-sm font-medium text-gray-300">Live Link</Label>
              <Input 
                id="liveLink" 
                value={currentProject.liveLink || ""} 
                onChange={(e) => setCurrentProject({...currentProject, liveLink: e.target.value})} 
                placeholder="Enter live project URL" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium text-gray-300">Year</Label>
              <Input 
                id="year" 
                value={currentProject.year || ""} 
                onChange={(e) => setCurrentProject({...currentProject, year: e.target.value})} 
                placeholder="Year completed" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>

            <Button 
              type="button" 
              onClick={handleSaveProject}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingIndex !== null ? 'Update Project' : 'Add Project'}
            </Button>
          </div>

          {projects.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium text-white">Saved Projects</h3>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={project.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{project.projectName}</h4>
                        <p className="text-sm text-gray-400 mt-1">{project.projectDescription?.substring(0, 100)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editProject(index)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteProject(index)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.map((tech, techIndex) => (
                          <span key={techIndex} className="text-xs bg-gray-700 px-2 py-1 rounded">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectSidebar