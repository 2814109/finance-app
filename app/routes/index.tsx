export let meta = () => {
  return {
    title: "Remix Secrets App",
  };
};
export default function Index() {
  return (
    <div className="remix__page">
      <main>
        <h2>Remix Secrets</h2>
        <p>Save all your secret stuff here!</p>
      </main>
    </div>
  );
}
