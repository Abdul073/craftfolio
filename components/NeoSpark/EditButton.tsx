import { Button } from '@/components/ui/button'
import { setCurrentEdit } from '@/slices/editModeSlice';
import { RootState } from '@/store/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const EditButton = ({sectionName} : {sectionName : string}) => {

    const dispatch = useDispatch();

    const {currentlyEditing} = useSelector((state: RootState) => state.editMode);

    const handleSectionEdit = () => {

        if (currentlyEditing === sectionName) {
          dispatch(setCurrentEdit(''));
        } else {
          dispatch(setCurrentEdit(sectionName));
        }

      };
    

  return (
    
    <div className="absolute right-24 -top-12">
    <Button
      onClick={handleSectionEdit} 
      className="bg-transparent tracking-wider text-white hover:bg-transparent border border-dashed border-gray-300 shadow transition-all px-4 py-2 text-sm"
    >
      {currentlyEditing === sectionName ? "Cancel" : (
        <>
         ✏️ Edit
        </>
      )}
    </Button>
  </div>
  )
}

export default EditButton