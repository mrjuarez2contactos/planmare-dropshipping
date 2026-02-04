-- Create users table (optional if using Supabase Auth, but good for profile data)
-- Supabase Auth already has a users table in auth schema. 
-- We'll create a public.profiles table that links to auth.users.

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  brand_name TEXT,
  domain TEXT,
  niche TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  sell_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create copywriting table
CREATE TABLE public.copywriting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on copywriting
ALTER TABLE public.copywriting ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Users can manage their own projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Products: Users can manage products of their own projects
CREATE POLICY "Users can manage products of own projects" ON public.products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = products.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Copywriting: Users can manage copywriting of their products
CREATE POLICY "Users can manage copywriting of own products" ON public.copywriting
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.products
    JOIN public.projects ON projects.id = products.project_id
    WHERE products.id = copywriting.product_id
    AND projects.user_id = auth.uid()
  )
);

-- Trigger for profiles
-- This function will insert a row into public.profiles when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
