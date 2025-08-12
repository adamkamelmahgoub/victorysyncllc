
-- Create indexes in a single statement block
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_orders_created_at') THEN
    CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
  END IF;
END $$;
