import { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/hooks/useGamification';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import ProfileDropdown from '@/components/ProfileDropdown';
import {
  GraduationCap,
  MessageCircleQuestion,
  BookOpen,
  Trophy,
  ClipboardList,
  Target,
  LogOut,
  Flame,
} from 'lucide-react';

const navItems = [
  { title: 'AI Doubt Solver', icon: MessageCircleQuestion, url: '/student' },
  { title: 'My Classes', icon: GraduationCap, url: '/student/classes' },
  { title: 'Lecture Summarizer', icon: BookOpen, url: '/student/summarizer' },
  { title: 'Quiz Arena', icon: Trophy, url: '/student/quizzes' },
  { title: 'Assignments', icon: ClipboardList, url: '/student/assignments' },
  { title: 'Explain My Mistake', icon: Target, url: '/student/mistakes' },
];

const StudentLayout = () => {
  const { getLevelThreshold } = useGamification();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Mock profile data for now until a real gamification backend is properly hooked logic
  const profile = { xp: 150, level: 2, streak_days: 5 };

  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const streak = profile?.streak_days || 0;
  const xpForNextLevel = useMemo(() => getLevelThreshold(level + 1), [level, getLevelThreshold]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">EduGame AI</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {/* User Stats */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Level {level}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={(xp / xpForNextLevel) * 100} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground">{xp} XP</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-destructive" />
                <span className="font-medium">{streak} day streak!</span>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 gap-4 bg-card">
            <SidebarTrigger />
            <div className="flex-1" />
            <ProfileDropdown />
          </header>
          <div className="flex-1 p-6 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;
