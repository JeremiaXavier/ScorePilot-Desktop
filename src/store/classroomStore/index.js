import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

// Define the classroom store
export const classroomStore = create((set, get) => ({
  classrooms: [], // Array to hold classrooms
  set: (data) => set({ ...data }),
  // Action to add a new classroom
  addClassroom: (newClassroom) => set((state) => ({
    classrooms: [...state.classrooms, newClassroom],
  })),

  // Action to update an existing classroom
  updateClassroom: (updatedClassroom) => set((state) => ({
    classrooms: state.classrooms.map((classroom) => 
      classroom.id === updatedClassroom.id ? { ...classroom, ...updatedClassroom } : classroom
    ),
  })),

  // Action to remove a classroom
  removeClassroom: (classroomId) => set((state) => ({
    classrooms: state.classrooms.filter((classroom) => classroom.id !== classroomId),
  })),

  // Action to get a classroom by ID
  getClassroomById: (classroomId) => {
    return get().classrooms.find(classroom => classroom.id === classroomId);
  },
  
  // Action to fetch classrooms from an API (replace '/api/classrooms' with your actual API endpoint)
  
}));
