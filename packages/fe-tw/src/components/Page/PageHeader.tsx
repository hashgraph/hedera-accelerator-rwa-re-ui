export const PageHeader = ({ title }: { title: string }) => {
	return (
		<div className="p-6 pl-20 bg-primary-content">
			<article className="prose prose-slate">
				<h1>{title}</h1>
			</article>
		</div>
	);
};
