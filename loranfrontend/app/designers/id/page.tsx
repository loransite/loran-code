export default function DesignerProfile({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold">Designer: {params.id}</h1>
      <p className="mt-4 text-gray-600">Profile coming soon...</p>
    </div>
  );
}
