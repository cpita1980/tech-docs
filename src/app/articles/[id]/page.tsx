export default async function ArticlePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Article ID: {params.id}</h1>
      <p>This is a temporary page for debugging a build issue.</p>
    </div>
  );
}