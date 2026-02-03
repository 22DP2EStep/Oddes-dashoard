# Supabase Dashboard Setup Guide

## Quick Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Open your project
3. Go to **Settings** > **API**
4. Copy your:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Update Environment Variables

Edit `/workspaces/Oddes-dashoard/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
VITE_TABLE_NAME=your_table_name
```

### 3. Configure Your Table Structure

Edit `src/views/HomeView.vue` around line 120, update the `TABLE_CONFIG`:

```javascript
const TABLE_CONFIG = {
  tableName: 'your_actual_table_name', // Your Supabase table name
  columns: {
    value: 'amount',      // Column with numeric values (for sorting pipeline)
    name: 'client_name',  // Column with names/titles to display
    status: 'status',     // Column with status (Active, Inactive, etc.)
    created_at: 'created_at' // Timestamp column
  }
}
```

### 4. Example Table Structure

Your Supabase table might look like this:

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  amount DECIMAL(10,2),
  status VARCHAR(50),
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Test the Connection

1. Save your changes
2. The dashboard will automatically reload
3. Check the browser console for any errors
4. If successful, you'll see your real data in the dashboard

## Common Table Column Mappings

| Dashboard Feature | Recommended Column Names |
|-------------------|-------------------------|
| Pipeline values | `amount`, `value`, `deal_size`, `revenue` |
| Names/Titles | `name`, `client_name`, `company`, `title` |
| Status tracking | `status`, `stage`, `phase` |
| Creation date | `created_at`, `date_created`, `timestamp` |

## Troubleshooting

### "Failed to load data from Supabase"
1. Check your `.env.local` file has correct credentials
2. Verify your table name is correct
3. Make sure your table exists in Supabase
4. Check browser console for detailed error messages

### "RLS Error" or Permission Denied
1. In Supabase, go to **Authentication** > **Policies**
2. For testing, you can disable RLS temporarily:
   ```sql
   ALTER TABLE your_table_name DISABLE ROW LEVEL SECURITY;
   ```
3. Or create a policy to allow reads:
   ```sql
   CREATE POLICY "Allow read access" ON your_table_name
   FOR SELECT USING (true);
   ```

### No Data Showing
1. Verify your table has data
2. Check that column names in `TABLE_CONFIG` match your actual columns
3. Look in browser console for JavaScript errors

## Next Steps

Once connected, you can:
- Customize the metrics calculations in `HomeView.vue`
- Add more chart types using your data
- Modify the pipeline stages based on your business logic
- Add real-time updates using Supabase subscriptions