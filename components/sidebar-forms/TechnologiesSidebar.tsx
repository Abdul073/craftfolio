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
import { updateTechnologies } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'

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
        logo: "https://cdn-icons-png.flaticon.com/512/6062/6062643.png"
      }
      addSuggestion(customTech)
    }
  }

  const handleSaveChanges = async() => {
    try {
      setIsLoading(true);
      dispatch(updatePortfolioData({ sectionType: "technologies", newData: selected }));
      await updateTechnologies({ portfolioId: portfolioId, selectedTech: selected });
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
    <div className='custom-scrollbar'>
      <Card className=''>
        <CardHeader>
          <CardTitle>Technologies</CardTitle>
          <CardDescription>Search and add technologies to your stack</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className='flex items-center justify-between gap-4 mb-4'>
              <Input 
                type='text'
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                placeholder='Search Technologies...'
                className="bg-gray-800 border-gray-700 text-white"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && suggestions.length > 0) {
                    addSuggestion(suggestions[0])
                  } else if (e.key === 'Enter' && searchValue.trim() !== "") {
                    handleAddCustomTech();
                  }
                }}
              />
              <Button onClick={handleAddCustomTech}>Add</Button>
            </div>
            
            {/* Suggestions Section */}
            {suggestions.length > 0 ? (
              <div className='mb-6'>
                <h3 className='text-sm font-medium mb-2'>Suggestions</h3>
                <div>
                  {suggestions.map((item: Technology, index : number) => (
                    <div 
                      onClick={() => addSuggestion(item)}
                      key={index}
                      className='flex bg-stone-700/25 border border-white/15 px-4 mt-2 rounded-lg items-center justify-between gap-4 py-2 cursor-pointer hover:bg-stone-700/40 transition-colors'
                    >
                      <span className='text-sm'>{item.name}</span>
                      <img src={item.logo} alt={item.name} width={25} height={25} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              hasSearched && (
                <div className='bg-stone-700/25 border border-white/15 rounded-lg p-4 text-center mb-6'>
                  <p className='text-sm text-gray-400'>No technologies found matching "{searchValue}"</p>
                  <p className='text-xs mt-1 text-gray-500'>Use the Add button to add it as a custom technology</p>
                </div>
              )
            )}
            
            {selected.length > 0 ? (
              <div>
                <h3 className='text-sm font-medium mb-2'>Selected Technologies</h3>
                <div>
                  {selected.map((item: Technology,index : number) => (
                    <div 
                      key={index}
                      className='flex bg-stone-700/25 border border-white/15 px-4 mt-2 rounded-lg items-center justify-between py-2'
                    >
                      <div className='flex items-center gap-4'>
                        <img src={item.logo} alt={item.name} width={25} height={25} />
                        <span className='text-sm'>{item.name}</span>
                      </div>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTech(item)}
                        className='p-1 h-auto hover:bg-red-500/20'
                      >
                        <X size={16} className='text-red-400' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='bg-stone-700/25 border border-white/15 rounded-lg p-4 text-center'>
                <p className='text-sm text-gray-400'>No technologies selected</p>
              </div>
            )}
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
              className={hasChanges ? "flex-1" : "w-full"}
              onClick={handleSaveChanges}
              disabled={isLoading || !hasChanges}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TechnologiesSidebar