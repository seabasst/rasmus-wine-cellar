-- Wine Cellar Database Schema
-- Run this in your Supabase SQL Editor (SQL Editor > New Query)

-- Create enum for wine categories
CREATE TYPE wine_category AS ENUM (
  'red',
  'white',
  'rose',
  'sparkling',
  'dessert',
  'fortified',
  'orange'
);

-- Create wines table
CREATE TABLE wines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  producer TEXT NOT NULL,
  region TEXT,
  country TEXT,
  vintage INTEGER,
  category wine_category NOT NULL DEFAULT 'red',
  grape_variety TEXT,
  bottle_count INTEGER NOT NULL DEFAULT 0,
  glass_price DECIMAL(10,2),
  bottle_price DECIMAL(10,2),
  tasting_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_wines_category ON wines(category);
CREATE INDEX idx_wines_is_active ON wines(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wines_updated_at
  BEFORE UPDATE ON wines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (for future multi-user support)
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (single user mode)
-- When adding auth, replace this with proper policies
CREATE POLICY "Allow all operations for now" ON wines
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert some sample wines to get started
INSERT INTO wines (name, producer, region, country, vintage, category, grape_variety, bottle_count, glass_price, bottle_price, tasting_notes, is_active) VALUES
  ('Barolo Riserva', 'Giacomo Conterno', 'Piedmont', 'Italy', 2018, 'red', 'Nebbiolo', 6, 28.00, 180.00, 'Complex with notes of tar, roses, and dried herbs. Long finish.', true),
  ('Chablis Premier Cru', 'William Fèvre', 'Burgundy', 'France', 2021, 'white', 'Chardonnay', 12, 18.00, 75.00, 'Crisp minerality with citrus and green apple notes.', true),
  ('Champagne Brut', 'Krug', 'Champagne', 'France', null, 'sparkling', 'Blend', 4, 45.00, 280.00, 'Rich and toasty with fine bubbles and exceptional depth.', true),
  ('Sancerre', 'Domaine Vacheron', 'Loire Valley', 'France', 2022, 'white', 'Sauvignon Blanc', 18, 14.00, 55.00, 'Fresh and vibrant with grapefruit and flinty minerality.', true),
  ('Chianti Classico Riserva', 'Fontodi', 'Tuscany', 'Italy', 2019, 'red', 'Sangiovese', 8, 16.00, 65.00, 'Cherry, leather, and spice with firm tannins.', true);
