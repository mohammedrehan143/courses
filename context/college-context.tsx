'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { College } from '@/types/database';
import { getColleges } from '@/lib/services/colleges';
import { MOCK_COLLEGES } from '@/lib/mock-data';

interface CollegeContextType {
  colleges: College[];
  selectedCollege: College | null;
  setSelectedCollege: (college: College | null) => void;
  isCollegeModalOpen: boolean;
  openCollegeModal: () => void;
  closeCollegeModal: () => void;
  loading: boolean;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export function CollegeProvider({ children }: { children: React.ReactNode }) {
  const [colleges, setColleges] = useState<College[]>(MOCK_COLLEGES);
  const [selectedCollege, setSelectedCollegeState] = useState<College | null>(MOCK_COLLEGES[0]);
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadColleges() {
      try {
        const list = await getColleges();
        setColleges(list);

        // Check stored selection
        const storedId = localStorage.getItem('cosurf_selected_college_id');
        if (storedId) {
          const match = list.find((c) => c.id === storedId);
          if (match) {
            setSelectedCollegeState(match);
            return;
          }
        }

        // Default to first active college (BMSIT)
        if (list.length > 0) {
          setSelectedCollegeState(list[0]);
          localStorage.setItem('cosurf_selected_college_id', list[0].id);
        }
      } catch (err) {
        console.error('Error loading colleges', err);
      } finally {
        setLoading(false);
      }
    }

    loadColleges();
  }, []);

  const setSelectedCollege = (college: College | null) => {
    setSelectedCollegeState(college);
    if (college) {
      localStorage.setItem('cosurf_selected_college_id', college.id);
    } else {
      localStorage.removeItem('cosurf_selected_college_id');
    }
  };

  const openCollegeModal = () => setIsCollegeModalOpen(true);
  const closeCollegeModal = () => setIsCollegeModalOpen(false);

  return (
    <CollegeContext.Provider
      value={{
        colleges,
        selectedCollege,
        setSelectedCollege,
        isCollegeModalOpen,
        openCollegeModal,
        closeCollegeModal,
        loading,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
}

export function useCollege() {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
}
