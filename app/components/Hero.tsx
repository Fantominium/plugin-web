export default function Hero() {
  return (
    <section style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover Events</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>The pulse of Barbados is at your fingertips</p>
        <button style={{
          padding: '12px 32px',
          fontSize: '1rem',
          background: '#ff6b6b',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </div>
    </section>
  )
}
