import ServicesGrid from "../Sections/ServicesGrid.jsx";

export default function Services({ data, onPage, onOpenService }) {
  return (
    <main>
      <ServicesGrid data={data} onPage={onPage} onOpenService={onOpenService} home={false} />
    </main>
  );
}
