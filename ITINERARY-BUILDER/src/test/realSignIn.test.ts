/// <reference types="vitest" />
import { test, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

test('real signInWithPassword works with test user', async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'testuser@example.com',
    password: 'FCIT123',
  });

  expect(error).toBeNull();
  expect(data.user?.email).toBe('testuser@example.com');
});



