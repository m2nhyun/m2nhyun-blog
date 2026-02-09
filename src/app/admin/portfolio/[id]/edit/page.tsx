import { EditPortfolio } from '@/features/portfolio';

interface EditPortfolioPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({
    params,
}: EditPortfolioPageProps) {
    const { id } = await params;
    return <EditPortfolio itemId={id} />;
}
