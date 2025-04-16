"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser, updateUserProfile } from "@/api/user";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  university_id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string | null;
  login: string | null;
  gender: string | null;
  course_grade: string | null;
  faculty: string | null;
  speciality: string | null;
  academic_degree: string | null;
  birthday: string | null;
  status: string;
  image: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await fetchCurrentUser();
        setProfile(userData); // ✅ Now correctly assigning user data
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile.",
        });
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      if (!profile) return;

      await updateUserProfile(profile, selectedImage);

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });

      setIsEditing(false);
      setSelectedImage(undefined);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
    }
  };

  if (!profile) {
    return <div className="text-center mt-20 text-lg">Loading profile...</div>;
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-100 p-6">
      <Card className="w-full bg-white shadow-lg rounded-lg">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.image || "/assets/images/default-avatar.png"} alt="Profile" />
            <AvatarFallback>{profile.name.charAt(0)}{profile.surname.charAt(0)}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl mt-2 font-semibold">
            {profile.name} {profile.surname}
          </CardTitle>
          <Badge variant="secondary">{profile.status}</Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">University ID:</span>
            <span className="text-gray-500">{profile.university_id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-500">{profile.email}</span>
          </div>

          {/* Editable Fields */}
          <div>
            <Label className="text-sm font-medium">Phone Number</Label>
            <Input
              value={profile.phone_number || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Faculty</Label>
            <Input
              value={profile.faculty || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, faculty: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Speciality</Label>
            <Input
              value={profile.speciality || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, speciality: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Academic Degree</Label>
            <Input
              value={profile.academic_degree || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, academic_degree: e.target.value })}
            />
          </div>

          <Separator />

          <div className="flex justify-between mt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
