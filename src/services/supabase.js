import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkrbahoxnhijzpyvrvbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcmJhaG94bmhpanpweXZydmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjM2MzksImV4cCI6MjA2MTEzOTYzOX0.wXOyGfo_KG6psM-f245PYm6ujR_h3S7095dgHlOMzs0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
