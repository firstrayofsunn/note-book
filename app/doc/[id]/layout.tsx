// app/doc/[id]/layout.tsx

import RoomProvider from "@/components/RoomProvider";


const DocLayout = ({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  // Simply render the RoomProvider with the room ID
  return <RoomProvider eoomId={id}>{children}</RoomProvider>;
};

export default DocLayout;

// SERVER-SIDE FUNCTION (NEXT.JS APP DIRECTORY)
// Use a middleware or `generateStaticParams` to ensure authentication
// Refer to Next.js docs for App Router-specific guidance.
