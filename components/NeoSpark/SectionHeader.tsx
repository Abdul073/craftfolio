import React from "react";
import EditButton from "../EditButton";

const SectionHeader = ({ sectionName, sectionTitle, sectionDescription, titleColor }: { sectionName: string, sectionTitle: string, sectionDescription: string, titleColor: string }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="max-w-xl block mx-auto">
        <h1
          className="text-4xl section-title font-bold mb-4 text-center"
          style={{ color: titleColor }}
        >
          {sectionTitle}
        </h1>
        <p className="text-xl section-description text-gray-300 text-center mb-16">
          {sectionDescription}
        </p>
        <EditButton sectionName={sectionName} styles="ml-auto mr-20" />
      </div>
    </div>
  );
};

export default SectionHeader;
