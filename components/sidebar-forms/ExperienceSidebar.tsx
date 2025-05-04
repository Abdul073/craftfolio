import { RootState } from '@/store/store'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, X, Edit, Trash, Check } from 'lucide-react'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateExperience } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'
import { techList } from '@/lib/techlist'

const ExperienceSidebar = () => {
  interface Technology {
    name: string;
    logo: string;
  }
  
  interface Experience {
    role?: string;
    companyName?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    techStack?: Technology[];
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
  const [suggestions, setSuggestions] = useState<Technology[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const dispatch = useDispatch();

  useEffect(() => {
    if (experienceData && experienceData.length > 0) {
      setExperiences(experienceData);
    }
  }, [experienceData]);

  const handleTechInputChange = (value: string) => {
    setTechInput(value);
    setHasSearched(value.trim() !== "");
    
    if(value.trim() === "") {
      setSuggestions([]);
    } else {
      const results = techList.filter((item: Technology) => 
        item.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(results.slice(0, 4));
    }
  }

  const addTechItem = (tech: Technology) => {
    if (!currentExperience.techStack?.some(item => item.name === tech.name)) {
      setCurrentExperience({
        ...currentExperience,
        techStack: [...(currentExperience.techStack || []), tech]
      });
    }
    setTechInput("");
    setSuggestions([]);
    setHasSearched(false);
  }

  const addCustomTech = () => {
    if (techInput.trim() !== "") {
      const customTech: Technology = {
        name: techInput.trim(),
        logo: `https://placehold.co/100x100?text=${techInput.trim()}&font=montserrat&fontsize=18`
      };
      addTechItem(customTech);
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
                <Label className="text-sm font-medium text-gray-300 mb-2">Tech Stack / Skills</Label>
                <div className="flex gap-2 w-full">
                  <Input 
                    value={techInput} 
                    onChange={(e) => handleTechInputChange(e.target.value)} 
                    placeholder="Search technologies..." 
                    className="bg-gray-800 border-gray-700 text-white flex-1" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && suggestions.length > 0) {
                        addTechItem(suggestions[0]);
                      } else if (e.key === 'Enter' && techInput.trim() !== "") {
                        addCustomTech();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addCustomTech}
                    className="h-9 bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              
              {/* Tech suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4 mt-1">
                  {suggestions.map((tech) => (
                    <div 
                      key={tech.name}
                      onClick={() => addTechItem(tech)}
                      className="flex bg-stone-700/25 border border-white/15 px-3 py-2 mt-1 rounded-lg items-center justify-between gap-2 cursor-pointer hover:bg-stone-700/40 transition-colors"
                    >
                      <span className="text-sm">{tech.name}</span>
                      <img src={tech.logo} alt={tech.name} width={20} height={20} />
                    </div>
                  ))}
                </div>
              )}
              
              {hasSearched && suggestions.length === 0 && (
                <div className="bg-stone-700/25 border border-white/15 rounded-lg p-3 text-center my-2">
                  <p className="text-sm text-gray-400">No technologies found matching "{techInput}"</p>
                  <p className="text-xs mt-1 text-gray-500">Click Add to create it as a custom technology</p>
                </div>
              )}
              
              {/* Selected tech stack */}
              {currentExperience.techStack && currentExperience.techStack.length > 0 && (
                <div className="mt-3">
                  <Label className="text-xs font-medium text-gray-400 mb-1">Selected Technologies</Label>
                  <div className="space-y-2 mt-2">
                    {currentExperience.techStack.map((tech, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 rounded-md px-3 py-2">
                        <div className="flex items-center gap-2">
                          <img src={tech.logo} alt={tech.name} className="w-5 h-5" />
                          <span className="text-sm text-white">{tech.name}</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeTechItem(index)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="button" 
              onClick={handleSaveExperience}
              className="w-full"
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
                        {experience.techStack && experience.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {experience.techStack.map((tech, techIndex) => (
                              <div key={techIndex} className="bg-gray-700/60 text-xs text-gray-300 px-2 py-1 rounded">
                                {tech.name}
                              </div>
                            ))}
                          </div>
                        )}
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