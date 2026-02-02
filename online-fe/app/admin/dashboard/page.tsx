// app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1>📊 Admin Dashboard</h1>
      <p>Welcome to the admin panel! You can access this directly from:</p>
      <p><code>http://localhost:3000/admin</code></p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Users</h3>
          <p>Total: 1,234</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Orders</h3>
          <p>Today: 56</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Revenue</h3>
          <p>$12,345</p>
        </div>
      </div>
    </div>
  );
}