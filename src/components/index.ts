// FSD Migration: 기존 import 경로 호환성을 위한 re-export
// 점진적으로 새로운 FSD 경로로 변경 권장

// 기본 widgets (안전한 re-export)
export { Header } from '@/widgets/header';
export { Footer } from '@/widgets/footer';

// 기본 theme features (안전한 re-export)
export { ThemeProvider } from '@/features/theme';
export { DarkModeToggle } from '@/features/theme';

// 기본 UI components (주의: 필요시에만 개별 import 권장)
export {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
} from '@/shared/ui/card';
export { Switch } from '@/shared/ui/switch';
export {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from '@/shared/ui/menubar';
