import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import ProfileDropdown from '@/components/ProfileDropdown';
import {
  GraduationCap,
  Users,
  FileQuestion,
  ClipboardList,
  BarChart3,
  Lightbulb,
  LogOut,
} from 'lucide-react';

const navItems = [
  { title: 'Classes', icon: Users, url: '/teacher' },
  { title: 'Quiz Generator', icon: FileQuestion, url: '/teacher/quizzes' },
  { title: 'My Quizzes', icon: FileQuestion, url: '/teacher/saved-quizzes' },
  { title: 'Assignments', icon: ClipboardList, url: '/teacher/assignments' },
  { title: 'Analytics', icon: BarChart3, url: '/teacher/analytics' },
  { title: 'AI Lesson Planner', icon: Lightbulb, url: '/teacher/lesson-planner' },
  { title: 'Saved Plans', icon: Lightbulb, url: '/teacher/saved-lesson-plans' },
];

const TeacherLayout = () => {
  const location = useLocation();
  const { user, signOut } = useAuth(); // Actual user

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
            {/* User Info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Teacher</p>
                </div>
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

export default TeacherLayout;
