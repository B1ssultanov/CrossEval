"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/index";
import { toggleMode, setMode } from "@/store/slices/modeSlice";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Mode } from "@/types/mode";
import { GraduationCap, BriefcaseBusiness } from "lucide-react";


export default function ModeSwitch() {
  const modeFromStore = useSelector((state: RootState) => state.mode.mode);
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setModeState] = useState<Mode>("student"); // Local state for rendering

  // Load mode from LocalStorage only once when component mounts
  useEffect(() => {
    const savedMode = localStorage.getItem("mode") as Mode | null;
    if (savedMode && savedMode !== modeFromStore) {
      dispatch(setMode(savedMode));
    }
  }, [dispatch, modeFromStore]);

  // Sync local state with Redux mode
  useEffect(() => {
    setModeState(modeFromStore);
  }, [modeFromStore]);

  return (
    <div className="flex items-center space-x-2">
      <span className="font-bold text-base">{mode === "student" ? "Student" : "Supervisor"}</span>
      <GraduationCap size={25} className="text-orange-400" />
      <Switch
        checked={mode === "supervisor"}
        onCheckedChange={() => dispatch(toggleMode())}
      />
      <BriefcaseBusiness size={25} className="text-indigo-500" />
    </div>
  );
}
