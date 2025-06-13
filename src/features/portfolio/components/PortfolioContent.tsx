'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';

// TODO: entities/portfolio-item에서 타입 import 예정
interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    category: 'web' | 'mobile' | 'desktop' | 'library';
    featured: boolean;
    createdAt: string;
}

export const PortfolioContent = () => {
    const [projects, setProjects] = useState<PortfolioItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        { value: 'all', label: '전체' },
        { value: 'web', label: '웹' },
        { value: 'mobile', label: '모바일' },
        { value: 'desktop', label: '데스크톱' },
        { value: 'library', label: '라이브러리' },
    ];

    useEffect(() => {
        // TODO: services에서 포트폴리오 목록 가져오기 로직 구현
        const fetchProjects = async () => {
            try {
                // 임시 데이터
                const mockProjects: PortfolioItem[] = [
                    {
                        id: '1',
                        title: 'Minhyun Blog',
                        description:
                            'Next.js와 TypeScript를 사용하여 개발한 개인 블로그입니다. FSD 아키텍처를 적용하고 Firebase를 통한 실시간 데이터 관리, MDX 기반 포스팅 시스템을 구현했습니다.',
                        technologies: [
                            'Next.js',
                            'TypeScript',
                            'Tailwind CSS',
                            'Firebase',
                            'MDX',
                        ],
                        githubUrl: 'https://github.com/m2nhyun/blog',
                        liveUrl: 'https://m2nhyun-blog.vercel.app/',
                        category: 'web',
                        featured: true,
                        createdAt: '2024-01-01',
                    },
                    {
                        id: '2',
                        title: 'React Component Library',
                        description:
                            '재사용 가능한 React 컴포넌트 라이브러리입니다. Storybook을 활용한 문서화와 테스트를 포함하고 있습니다.',
                        technologies: [
                            'React',
                            'TypeScript',
                            'Storybook',
                            'Rollup',
                        ],
                        githubUrl:
                            'https://github.com/m2nhyun/react-components',
                        category: 'library',
                        featured: false,
                        createdAt: '2023-12-01',
                    },
                    {
                        id: '3',
                        title: 'Mobile App Project',
                        description:
                            'React Native를 사용하여 개발한 크로스 플랫폼 모바일 애플리케이션입니다.',
                        technologies: ['React Native', 'TypeScript', 'Expo'],
                        githubUrl: 'https://github.com/m2nhyun/mobile-app',
                        category: 'mobile',
                        featured: true,
                        createdAt: '2023-11-01',
                    },
                ];

                setProjects(mockProjects);
            } catch (error) {
                console.error('Failed to fetch portfolio projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects =
        selectedCategory === 'all'
            ? projects
            : projects.filter(
                  (project) => project.category === selectedCategory,
              );

    const featuredProjects = projects.filter((project) => project.featured);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                    로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    포트폴리오
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    다양한 기술과 도구를 활용하여 개발한 프로젝트들을
                    소개합니다.
                </p>
            </div>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        주요 프로젝트
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {featuredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                featured
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* All Projects */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        모든 프로젝트
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() =>
                                    setSelectedCategory(category.value)
                                }
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                         ${
                                             selectedCategory === category.value
                                                 ? 'bg-blue-600 text-white'
                                                 : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                         }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            해당 카테고리에 프로젝트가 없습니다.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

interface ProjectCardProps {
    project: PortfolioItem;
    featured?: boolean;
}

const ProjectCard = ({ project, featured = false }: ProjectCardProps) => {
    return (
        <div
            className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden 
                        bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300
                        ${featured ? 'lg:col-span-1' : ''}`}
        >
            {project.image && (
                <div className="aspect-video bg-gray-100 dark:bg-gray-700">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {project.title}
                    </h3>
                    {project.featured && (
                        <span
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 
                                       text-blue-800 dark:text-blue-200 rounded-full"
                        >
                            Featured
                        </span>
                    )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                                     text-gray-700 dark:text-gray-300 rounded-md"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex gap-3">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm 
                                     text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                                     rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            코드
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm 
                                     bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            라이브
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
