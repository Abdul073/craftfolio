import { RootState } from '@/store/store'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, X, Edit, Trash } from 'lucide-react'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateExperience } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'

const ExperienceSidebar = () => {
  interface Experience {
    role?: string;
    companyName?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    techStack?: string[];
  }
  
  const emptyExperience: Experience = {
    role: "",
    companyName: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    techStack: []
  }

  const { portfolioData } = useSelector((state: RootState) => state.data)
  const experienceData = portfolioData?.find((item: any) => item.type === "experience")?.data || [];
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentExperience, setCurrentExperience] = useState<Experience>(emptyExperience);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [techInput, setTechInput] = useState<string>("");
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const dispatch = useDispatch();

  useEffect(() => {
    if (experienceData && experienceData.length > 0) {
      setExperiences(experienceData);
    }
  }, [experienceData]);

  const addTechStack = () => {
    if (techInput.trim()) {
      setCurrentExperience({
        ...currentExperience,
        techStack: [...(currentExperience.techStack || []), techInput.trim()]
      });
      setTechInput("");
    }
  }

  const removeTechItem = (index: number) => {
    const updatedTechStack = [...(currentExperience.techStack || [])];
    updatedTechStack.splice(index, 1);
    setCurrentExperience({
      ...currentExperience,
      techStack: updatedTechStack
    });
  }

  const handleSaveExperience = async() => {
    if (editingIndex !== null) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = currentExperience;
      dispatch(updatePortfolioData({ sectionType: "experience", newData: updatedExperiences }));
      await updateExperience({ portfolioId: portfolioId, experiences: updatedExperiences });
      setExperiences(updatedExperiences);
      setEditingIndex(null);
    } else {
      const updatedExperiences = [...experiences, currentExperience];
      dispatch(updatePortfolioData({ sectionType: "experience", newData: updatedExperiences }));
      await updateExperience({ portfolioId: portfolioId, experiences: updatedExperiences });
      setExperiences(updatedExperiences);
    }
    setCurrentExperience(emptyExperience);
    toast.success(editingIndex !== null ? 'Experience updated!' : 'Experience added!');
  }

  const editExperience = (index: number) => {
    const experienceToEdit = experiences[index];
    setCurrentExperience(experienceToEdit);
    setEditingIndex(index);
  }

  const deleteExperience = async(index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    dispatch(updatePortfolioData({ sectionType: "experience", newData: updatedExperiences }));
    await updateExperience({ portfolioId: portfolioId, experiences: updatedExperiences });
    setExperiences(updatedExperiences);
    toast.success('Experience deleted!');
  }

  return (
    <div className="custom-scrollbar">
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Manage your work experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-300">Role</Label>
              <Input 
                id="role" 
                value={currentExperience.role || ""} 
                onChange={(e) => setCurrentExperience({...currentExperience, role: e.target.value})} 
                placeholder="Enter your job title" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-300">Company Name</Label>
              <Input 
                id="companyName" 
                value={currentExperience.companyName || ""} 
                onChange={(e) => setCurrentExperience({...currentExperience, companyName: e.target.value})} 
                placeholder="Enter company name" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-300">Location</Label>
              <Input 
                id="location" 
                value={currentExperience.location || ""} 
                onChange={(e) => setCurrentExperience({...currentExperience, location: e.target.value})} 
                placeholder="City, Country or Remote" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-300">Start Date</Label>
                <Input 
                  id="startDate" 
                  value={currentExperience.startDate || ""} 
                  onChange={(e) => setCurrentExperience({...currentExperience, startDate: e.target.value})} 
                  placeholder="MM/YYYY" 
                  className="bg-gray-800 border-gray-700 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-300">End Date</Label>
                <Input 
                  id="endDate" 
                  value={currentExperience.endDate || ""} 
                  onChange={(e) => setCurrentExperience({...currentExperience, endDate: e.target.value})} 
                  placeholder="MM/YYYY or Present" 
                  className="bg-gray-800 border-gray-700 text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-300">Description</Label>
              <Textarea 
                id="description" 
                value={currentExperience.description || ""} 
                onChange={(e) => setCurrentExperience({...currentExperience, description: e.target.value})} 
                placeholder="Describe your responsibilities and achievements" 
                className="resize-none h-32 bg-gray-800 border-gray-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col justify-between items-start">
                <Label className="text-sm font-medium text-gray-300">Tech Stack / Skills</Label>
                <div className="flex gap-2">
                  <Input 
                    value={techInput} 
                    onChange={(e) => setTechInput(e.target.value)} 
                    placeholder="Add technology or skill" 
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
              
              {currentExperience.techStack && currentExperience.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentExperience.techStack.map((tech, index) => (
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

            <Button 
              type="button" 
              onClick={handleSaveExperience}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingIndex !== null ? 'Update Experience' : 'Add Experience'}
            </Button>
          </div>

          {experiences.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium text-white">Saved Experiences</h3>
              <div className="space-y-4">
                {experiences.map((experience, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{experience.role}</h4>
                        <p className="text-sm text-gray-400">{experience.companyName} • {experience.location}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {experience.startDate} - {experience.endDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editExperience(index)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteExperience(index)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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

export default ExperienceSidebar