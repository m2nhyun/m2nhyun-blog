export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    image?: string;
    images?: string[];
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    demoUrl?: string;
    category: 'web' | 'mobile' | 'desktop' | 'library' | 'design';
    status: 'completed' | 'in-progress' | 'planned';
    featured: boolean;
    order: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioItemCreateData {
    title: string;
    description: string;
    image?: string;
    images?: string[];
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    demoUrl?: string;
    category: 'web' | 'mobile' | 'desktop' | 'library' | 'design';
    status?: 'completed' | 'in-progress' | 'planned';
    featured?: boolean;
    order?: number;
    startDate?: string;
    endDate?: string;
}

export interface PortfolioItemUpdateData
    extends Partial<PortfolioItemCreateData> {
    id: string;
}
