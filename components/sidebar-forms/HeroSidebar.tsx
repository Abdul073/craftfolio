import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { updateHero } from '@/app/actions/portfolio';
import { redirect, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updatePortfolioData } from '@/slices/dataSlice';


const HeroSidebar = () => {
    let emptyContent = {
        titlePrefix: "",
        name : "",
        subtitle :"",
     }
     const [content, setContent] = useState(emptyContent);
  const params = useParams();
  const dispatch = useDispatch();
  const portfolioId = params.portfolioId as string;
  const {portfolioData} = useSelector((state: RootState) => state.data);

  
  if(!portfolioId){
    return redirect("/choose-templates");
  }
       const handleSubmit = async()=>{
         try {
          dispatch(updatePortfolioData({sectionType: "hero", newData : content}));
           const result = await updateHero({portfolioId : portfolioId, content : content});
           console.log(result)
         } catch (error) {
           console.log(error)
         }
       }

       console.log(portfolioData)
      

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titlePrefix" className="text-sm font-medium text-gray-300">Title Prefix</Label>
              <Input id="titlePrefix" defaultValue={content.titlePrefix} onChange={(e) => setContent({...content, titlePrefix: e.target.value})} placeholder="Enter title prefix" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">Name</Label>
              <Input id="name"  defaultValue={content.name} onChange={(e) => setContent({...content, name: e.target.value})} placeholder="Enter name" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-sm font-medium text-gray-300">Subtitle</Label>
              <Textarea 
                id="subtitle" 
                placeholder="Enter subtitle" 
                defaultValue={content.subtitle}
                onChange={(e) => setContent({...content, subtitle: e.target.value})}
                className="resize-none h-24 bg-gray-800 border-gray-700 text-white" 
              />
            </div>
          </CardContent>
          
          <CardFooter className="p-0 pt-4">
            <Button onClick={()=>handleSubmit()} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Save
            </Button>
          </CardFooter>
        </div>
  )
}

export default HeroSidebar