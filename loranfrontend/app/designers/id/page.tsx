export default async function DesignerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold">Designer: {id}</h1>
      <p className="mt-4 text-gray-600">Profile coming soon...</p>
    </div>
  );
}
