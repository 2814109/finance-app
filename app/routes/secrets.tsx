export let meta = () => {
  return {
    title: "Remix Secrets App - Secrets Page",
  };
};
export default function Secrets() {
  return (
    <div className="remix__page">
      <main>
        <h2>Remix Secrets (Private)</h2>
        <p>Eventually, your secrets will appear here.</p>
      </main>
    </div>
  );
}
