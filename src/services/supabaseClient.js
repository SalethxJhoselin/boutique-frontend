// boutique-frontend/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezojnzrongulnxcyoewy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6b2puenJvbmd1bG54Y3lvZXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTk2OTUsImV4cCI6MjA3ODEzNTY5NX0.vB9o6u8J06rcDM8YUmMesC9KTKMpOZYhQ_Ne13uveZc' // ← Desde Supabase → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey)