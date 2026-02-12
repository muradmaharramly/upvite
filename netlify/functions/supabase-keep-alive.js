const { createClient } = require('@supabase/supabase-js');

/**
 * Netlify Scheduled Function to keep Supabase project active.
 * This runs every 6 hours as configured in netlify.toml.
 */
const handler = async (event, context) => {
  console.log('Keep-alive function triggered at:', new Date().toISOString());

  // Use environment variables for Supabase connection
  // These should be set in Netlify UI: SUPABASE_URL and SUPABASE_ANON_KEY
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase environment variables are missing.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing environment variables' }),
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform a lightweight request to create activity
    // We select 1 from a standard table or just a simple query
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('Supabase activity recorded successfully.');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Supabase keep-alive successful',
        timestamp: new Date().toISOString()
      }),
    };
  } catch (err) {
    console.error('Supabase keep-alive failed:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create activity',
        details: err.message
      }),
    };
  }
};

module.exports = { handler };
