-- 1. Fix the trigger so future signups actually get their selected role instead of being forced into "student"!
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student'::public.app_role));
  RETURN NEW;
END;
$$;

-- 2. Since your current user was forced to be a "student" by the old trigger, 
-- we need to manually update your account to be a "teacher" so you aren't blocked by Row Level Security (RLS).
-- (This will update all current students to teachers for your local testing)
UPDATE public.user_roles 
SET role = 'teacher' 
WHERE role = 'student';
