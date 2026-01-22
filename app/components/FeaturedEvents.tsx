export default function FeaturedEvents() {
  const events = [
    { id: 1, title: 'Concert Night', date: 'Feb 15', category: 'Concerts' },
    { id: 2, title: 'Sports Championship', date: 'Feb 20', category: 'Sports' },
    { id: 3, title: 'Art Exhibition', date: 'Feb 25', category: 'Art' },
    { id: 4, title: 'Food Festival', date: 'Mar 5', category: 'Food' },
  ];

  return (
    <section style={{
      padding: '60px 24px',
      background: '#f5f5f5',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '40px',
          textAlign: 'center',
          color: '#1a1a2e'
        }}>
          Featured Events
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {events.map(event => (
            <div
              key={event.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{
                width: '100%',
                height: '200px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '8px',
                marginBottom: '16px'
              }} />
              <h3 style={{ marginBottom: '8px', color: '#1a1a2e' }}>{event.title}</h3>
              <p style={{ color: '#666', marginBottom: '8px' }}>{event.date}</p>
              <span style={{
                display: 'inline-block',
                background: '#ff6b6b',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px'
              }}>
                {event.category}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: '#1a1a2e',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '16px' }}>More Events Coming</h3>
          <p>Stay tuned for more exciting events happening in Barbados!</p>
        </div>
      </div>
    </section>
  )
}
