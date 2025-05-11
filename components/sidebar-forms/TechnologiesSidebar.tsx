import React, { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card'
import { techList } from '@/lib/techlist'
import { X, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateSection } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'
import { Label } from '../ui/label'

interface Technology {
  name: string;
  logo: string;
}

const TechnologiesSidebar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("")
  const [suggestions, setSuggestions] = useState<Technology[]>([])
  const [selected, setSelected] = useState<Technology[]>([])
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [originalSelected, setOriginalSelected] = useState<Technology[]>([])
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { portfolioData } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    if (portfolioData) {
      const techSectionData = portfolioData.find((section: any) => section.type === "technologies")?.data;
      if (techSectionData && Array.isArray(techSectionData)) {
        setSelected(techSectionData);
        setOriginalSelected(JSON.parse(JSON.stringify(techSectionData)));
      }
    }
  }, [portfolioData]);

  // Track changes
  useEffect(() => {
    setHasChanges(JSON.stringify(selected) !== JSON.stringify(originalSelected));
  }, [selected, originalSelected]);

  const handleChange = (value: string): void => {
    setSearchValue(value)
    setHasSearched(value.trim() !== "")
    
    if(value.trim() === "") {
      setSuggestions([])
    } else {
      const results = techList.filter((item: Technology) => 
        item.name.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(results.slice(0, 6))
    }
  }

  const addSuggestion = (item: Technology): void => {
    if (!selected.some(tech => tech.name === item.name)) {
      setSelected([...selected, item])
    }
    setSearchValue("")
    setSuggestions([])
    setHasSearched(false)
  }

  const removeTech = (itemToRemove: Technology): void => {
    setSelected(selected.filter(item => item.name !== itemToRemove.name))
  }

  const handleAddCustomTech = (): void => {
    if (searchValue.trim() !== "") {
      const customTech: Technology = {
        name: searchValue,
        logo: `https://placehold.co/100x100?text=${searchValue}&font=montserrat&fontsize=18`
      }
      addSuggestion(customTech)
    }
  }

  const handleSaveChanges = async() => {
    try {
      setIsLoading(true);
      dispatch(updatePortfolioData({ sectionType: "technologies", newData: selected }));
      await updateSection({ portfolioId: portfolioId,sectionName: "technologies", sectionContent: selected });
      setOriginalSelected(JSON.parse(JSON.stringify(selected)));
      setHasChanges(false);
      toast.success("Technologies updated successfully");
    } catch (error) {
      console.error("Error saving technologies:", error);
      toast.error("Failed to update technologies");
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    setSelected(JSON.parse(JSON.stringify(originalSelected)));
    setHasChanges(false);
    toast.success("Changes reset");
  };

  return (
    <div className="custom-scrollbar">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Technologies</CardTitle>
          <CardDescription className="text-gray-400">Manage your skills and technologies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="techSearch" className="text-sm font-medium text-gray-300">Add Technology</Label>
              <div className="flex gap-2">
                <Input
                  id="techSearch"
                  value={searchValue}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Search technologies..."
                  className="bg-gray-800 border-gray-700 text-gray-100 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && suggestions.length > 0) {
                      addSuggestion(suggestions[0]);
                    } else if (e.key === 'Enter' && searchValue.trim() !== "") {
                      handleAddCustomTech();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddCustomTech()}
                  disabled={!searchValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add
                </Button>
              </div>
              {suggestions.length > 0 && (
                <div className="mt-2 bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
                  {suggestions.map((tech, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-100"
                      onClick={() => addSuggestion(tech)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{tech.name}</span>
                        <img src={tech.logo} alt={tech.name} width={20} height={20} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Your Technologies</Label>
              <div className="flex flex-wrap gap-2">
                {selected.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-md px-2 py-1"
                  >
                    <span className="text-gray-100">{tech.name}</span>
                    <button
                      onClick={() => removeTech(tech)}
                      className="text-gray-400 hover:text-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className='pt-4 pb-6'>
          <div className="flex w-full space-x-2">
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
              >
                Reset
              </Button>
            )}
            <Button 
              className={`${hasChanges ? "flex-1" : "w-full"} bg-blue-600 hover:bg-blue-700 text-white`}
              onClick={handleSaveChanges}
              disabled={isLoading || !hasChanges}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default TechnologiesSidebar