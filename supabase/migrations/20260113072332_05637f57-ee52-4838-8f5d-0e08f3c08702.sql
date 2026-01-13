-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  display_name TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create interests table
CREATE TABLE public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on interests
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

-- Interests policies (read only for authenticated users)
CREATE POLICY "Authenticated users can view interests"
ON public.interests FOR SELECT
TO authenticated
USING (true);

-- Create user_interests junction table
CREATE TABLE public.user_interests (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, interest_id)
);

-- Enable RLS on user_interests
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- User interests policies
CREATE POLICY "Users can view their own interests"
ON public.user_interests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own interests"
ON public.user_interests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests"
ON public.user_interests FOR DELETE
USING (auth.uid() = user_id);

-- Seed initial interests
INSERT INTO public.interests (name, slug, icon) VALUES
  ('Technology', 'technology', '💻'),
  ('AI', 'ai', '🤖'),
  ('Startups', 'startups', '🚀'),
  ('Business', 'business', '💼'),
  ('Finance', 'finance', '💰'),
  ('Marketing', 'marketing', '📈'),
  ('Design', 'design', '🎨'),
  ('Productivity', 'productivity', '⚡'),
  ('Health', 'health', '🏥'),
  ('Fitness', 'fitness', '💪'),
  ('Nutrition', 'nutrition', '🥗'),
  ('Travel', 'travel', '✈️'),
  ('Cooking', 'cooking', '👨‍🍳'),
  ('Music', 'music', '🎵'),
  ('Movies', 'movies', '🎬'),
  ('Gaming', 'gaming', '🎮'),
  ('Sports', 'sports', '⚽'),
  ('Science', 'science', '🔬'),
  ('Education', 'education', '📚'),
  ('News', 'news', '📰'),
  ('Self-improvement', 'self-improvement', '🌱'),
  ('Photography', 'photography', '📷'),
  ('Fashion', 'fashion', '👗'),
  ('Art', 'art', '🖼️');

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();