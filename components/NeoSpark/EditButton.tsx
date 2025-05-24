import { Button } from '@/components/ui/button'
import { setCurrentEdit } from '@/slices/editModeSlice';
import { RootState } from '@/store/store';
import { useUser } from '@clerk/nextjs';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const EditButton = ({sectionName, styles} : {sectionName : string, styles? : string}) => {

    const dispatch = useDispatch();

    const {currentlyEditing} = useSelector((state: RootState) => state.editMode);
    const {portfolioUserId} = useSelector((state : RootState) => state.data)
    const {user} = useUser();

    if(user === null || !user?.id){
      return <div>loading..</div>
    }

    // If user is not the portfolio owner, don't show the edit button
    if (user.id !== portfolioUserId) {
      return null;
    }

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
          className={`bg-transparent ${styles} tracking-wider text-white hover:bg-transparent border border-dashed border-gray-300 shadow transition-all px-4 py-2 text-sm`}
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