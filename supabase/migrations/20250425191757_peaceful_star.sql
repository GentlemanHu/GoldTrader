-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Assets table
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'assets') THEN
    CREATE TABLE public.assets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(symbol, type)
    );
  END IF;
END $$;

-- Trades table
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trades') THEN
    CREATE TABLE public.trades (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
      trade_date DATE NOT NULL,
      entry_time TIMETZ,
      exit_time TIMETZ,
      side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
      entry_price NUMERIC(15,5),
      exit_price NUMERIC(15,5),
      position_size NUMERIC(15,2),
      profit_loss NUMERIC(15,2) NOT NULL,
      pips NUMERIC(10,1),
      risk_reward_ratio NUMERIC(10,2),
      strategy TEXT,
      session TEXT,
      timezone TEXT,
      screenshot_url TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;

-- Daily journals table
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'daily_journals') THEN
    CREATE TABLE public.daily_journals (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      journal_date DATE NOT NULL,
      emotional_state TEXT CHECK (emotional_state IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, journal_date)
    );
  END IF;
END $$;

-- Tags table
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tags') THEN
    CREATE TABLE public.tags (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      is_system BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(name, user_id)
    );
  END IF;
END $$;

-- Trade tags table
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trade_tags') THEN
    CREATE TABLE public.trade_tags (
      trade_id UUID REFERENCES public.trades(id) ON DELETE CASCADE,
      tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
      PRIMARY KEY (trade_id, tag_id)
    );
  END IF;
END $$;

-- Enable Row Level Security
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.daily_journals ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.trade_tags ENABLE ROW LEVEL SECURITY';
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'trades' AND policyname = 'Users can read own trades') THEN
    CREATE POLICY "Users can read own trades" ON public.trades
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'trades' AND policyname = 'Users can create own trades') THEN
    CREATE POLICY "Users can create own trades" ON public.trades
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'trades' AND policyname = 'Users can update own trades') THEN
    CREATE POLICY "Users can update own trades" ON public.trades
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'trades' AND policyname = 'Users can delete own trades') THEN
    CREATE POLICY "Users can delete own trades" ON public.trades
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_trades_updated_at') THEN
    CREATE TRIGGER update_trades_updated_at
      BEFORE UPDATE ON public.trades
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_journals_updated_at') THEN
    CREATE TRIGGER update_daily_journals_updated_at
      BEFORE UPDATE ON public.daily_journals
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;