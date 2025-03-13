import { PageBackButton } from "./PageBackButton";

export const PageHeader = ({ title }: { title: string }) => {
  return (
    <div className="p-6 pl-20 bg-lilac flex items-center">
      <PageBackButton />
      <article className="prose prose-slate ml-10">
        <h1>{title}</h1>
      </article>
    </div>
  );
};
