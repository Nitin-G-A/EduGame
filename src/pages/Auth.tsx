import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Target, Brain, Award, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">("student");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Redirect once session AND role are both known
  useEffect(() => {
    if (!loading && session && role) {
      navigate(role === "teacher" ? "/teacher" : "/student", { replace: true });
    }
  }, [session, role, loading, navigate]);

  // ─── Sign In ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Navigation is handled by the useEffect above once role loads
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  // ─── Sign Up ────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate teacher invite code before hitting the DB
    if (selectedRole === "teacher") {
      if (!inviteCode.trim()) {
        toast({
          variant: "destructive",
          title: "Invite code required",
          description: "Teachers must enter a valid invite code to sign up.",
        });
        return;
      }
    }

    setAuthLoading(true);
    try {
      // Step 1: Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error("Signup failed — no user returned.");

      // Step 2: If teacher, validate and apply invite code
      if (selectedRole === "teacher") {
        const { data: codeValid, error: codeError } = await supabase.rpc(
          "use_teacher_invite_code",
          { p_code: inviteCode.trim().toUpperCase(), p_user_id: data.user.id }
        );

        if (codeError || !codeValid) {
          // Rollback: delete the auth user we just created so they can try again
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Invalid invite code",
            description: "The teacher invite code you entered is incorrect or expired.",
          });
          return;
        }
      }

      // Step 3: If email confirmation is disabled (auto-confirmed), session is live
      // useEffect will handle redirect once role loads.
      // If email confirmation is ON, session will be null — show confirmation message.
      if (!data.session) {
        toast({
          title: "Check your email",
          description: "Click the confirmation link in your email to activate your account.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  // Show spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Don't render the form if already logged in (prevents flash before redirect)
  if (session && role) return null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* ── Left Column — Branding ── */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-primary/5 border-r">
        <div className="max-w-md mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
              Welcome to EduGame AI
            </h1>
            <p className="text-lg text-muted-foreground">
              A smarter way to learn and teach. Harness the power of AI to
              accelerate your educational journey.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Doubt Solver</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant, step-by-step explanations for your academic questions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Personalized Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Understand your mistakes and track your progress with smart analytics.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Gamified Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Earn XP, level up, and compete in the Quiz Arena.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Column — Auth Forms ── */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-[400px]">
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 mx-auto lg:hidden">
                <span className="text-2xl font-bold text-primary-foreground">E</span>
              </div>
              <CardTitle className="text-2xl text-center">Get Started</CardTitle>
              <TabsList className="grid w-full grid-cols-2 mt-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* ── Sign In Tab ── */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-muted-foreground"
                    onClick={() => toast({ title: "Reset password", description: "Contact your administrator to reset your password." })}
                  >
                    Forgot your password?
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* ── Sign Up Tab ── */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={(v: "student" | "teacher") => {
                        setSelectedRole(v);
                        setInviteCode(""); // clear invite code when switching
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Teacher invite code — only shown when teacher is selected */}
                  {selectedRole === "teacher" && (
                    <div className="space-y-2">
                      <Label htmlFor="invite-code">Teacher Invite Code</Label>
                      <Input
                        id="invite-code"
                        placeholder="Enter invite code (e.g. TEACHER2024)"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Contact your administrator for a teacher invite code.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
