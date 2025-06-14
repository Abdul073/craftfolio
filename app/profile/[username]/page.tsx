"use client"
import { useRouter,useParams } from 'next/navigation';
import React from 'react';

const ProfilePage = () => {
  const router = useRouter();
  const { username } = useParams(); // Capture subdomain as username
  if (!username) {
    // Optionally show a loading state if username is undefined
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hi {username}</h1>
      {/* Render user profile or any other data related to 'username' */}
    </div>
  );
};

export default ProfilePage;
