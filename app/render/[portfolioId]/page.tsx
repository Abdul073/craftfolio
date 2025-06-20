"use client"
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const params = useParams();
  const portfolioId = params.portfolioId as string;
  return (
    <div>
        {portfolioId}
    </div>
  )
}

export default page