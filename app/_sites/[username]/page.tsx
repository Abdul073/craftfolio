import React from 'react'

const page = ({params} : any) => {
    const { subdomain } = params;
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Subdomain: {subdomain}</h1>
        <p>This is a dynamic page for the subdomain {subdomain}.jupiters.in</p>
      </div>
    );  
}

export default page