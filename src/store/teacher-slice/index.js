import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Define the Zustand store
export const useTeacherUi = create((set) => ({

    students:[],
    assignments:[],
    selectedOptionforSidebar: 'classrooms',
    selectedClassroom:null,
     // default selected option
    setSelectedOptionforSidebar: (option) => set({ selectedOptionforSidebar: option }),
    loadStudents:async ()=>{
        try {
            const res = await axiosInstance.get("/teacher/students");
            set({students:res.data});
        } catch (error) {
            toast.error(error.message);
        }
    },
    setClassroom:(id)=>{
        set({selectedClassroom:id});
    }
}));


