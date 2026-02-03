# Supabase Dashboard Setup Guide

This Vue.js dashboard displays data from your Supabase tables with interactive charts and data tables.

## Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Configure Your Table

Update the following files with your table information:

#### `src/views/HomeView.vue`
- Line 65: Change `TABLE_NAME` to your actual table name
- Line 66: Change `GROUP_BY_COLUMN` to a column you want to group by for charts
- Lines 91-96: Update `tableColumns` array to match your table structure

#### `src/views/DataView.vue`
- Line 85: Change `TABLE_NAME` to your actual table name
- Lines 92-98: Update `tableColumns` array to match your table structure

#### `src/services/dataService.ts`
- Lines 6-12: Update the `DataItem` interface to match your table structure

### 3. Table Structure Example

If your table has these columns:
- `id` (number, primary key)
- `name` (text)
- `email` (text)
- `status` (text)
- `created_at` (timestamp)

Update the interfaces like this:

```typescript
// In src/services/dataService.ts
export interface DataItem {
  id: number
  name: string
  email: string
  status: string
  created_at: string
}

// In HomeView.vue and DataView.vue
const tableColumns = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'status', label: 'Status', type: 'text' },
  { key: 'created_at', label: 'Created At', type: 'date' },
]
```

### 4. Run the Development Server

```bash
npm run dev
```

## Features

- 📊 **Dashboard Overview**: Statistics cards and interactive charts
- 📋 **Data Table**: Paginated table with search and filtering
- 🔄 **Real-time Data**: Refresh functionality to get latest data
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and Heroicons

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Customization

### Adding New Charts
1. Add chart logic to `src/services/dataService.ts`
2. Import and use `ChartWidget` component in your views
3. Supported chart types: bar, line, doughnut, pie

### Adding New Statistics
1. Update `getStatistics()` method in `src/services/dataService.ts`
2. Add new `StatCard` components to your dashboard

### Customizing Styles
- Update Tailwind configuration in `tailwind.config.js`
- Modify component styles in individual `.vue` files
- Global styles in `src/assets/main.css`

## Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined"**
   - Check your Supabase URL and API key in `.env.local`
   - Verify your table name matches exactly

2. **"Failed to load data"**
   - Ensure your Supabase RLS policies allow reading from your table
   - Check browser network tab for specific error messages

3. **Charts not displaying**
   - Verify the `GROUP_BY_COLUMN` exists in your table
   - Check that the column has data to group by

### Need Help?

- Check the browser console for error messages
- Verify your Supabase table structure and permissions
- Ensure all environment variables are set correctly