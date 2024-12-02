"use client";


import Document from '@/components/Document';
import React from 'react';


const DocumentPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // Unwrap `params` using `React.use()`
  const { id } = React.use(params);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  );
};

export default DocumentPage;
