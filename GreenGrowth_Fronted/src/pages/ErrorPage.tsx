import React from 'react';
// The Header component is imported from your project structure and remains untouched.
import Header from '../components/header';

// --- SVG Icons (Unchanged) ---
const RestartIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>;
const HomeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.354a.5.5 0 0 0 .708.708L8 2.207l6.646 6.853a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/><path d="M13.293 8.354a.5.5 0 0 0-.708 0L7.5 13.293V14.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-4h2a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13.293 8.354Z"/></svg>;


const ErrorPage: React.FC = () => {
    return (
        <>
            <Header />
            <main style={styles.container}>
                {/* This pseudo-element creates the translucent overlay */}
                <div style={styles.overlay}></div>
                <div style={styles.content}>
                    <div style={styles.banner}>
                        <p style={styles.bannerText}>Opps! You've gone off the map</p>
                    </div>
                    
                    <div style={styles.illustrationWrapper}>
                        <div style={styles.earth}>
                            <div style={styles.sproutCharacter}>🌱</div>
                            <div style={styles.number4}>4</div>
                            <div style={styles.number0}>0</div>
                            <div style={styles.number4Second}>4</div>
                        </div>
                    </div>

                    <p style={styles.message}>
                        The page you're looking for might've grown roots somewhere else.
                    </p>

                    <div style={styles.buttonContainer}>
                        <a href="/" className="button-green" style={styles.buttonGreen}>
                            <RestartIcon />
                            <span>Restart Journey</span>
                        </a>
                        <a href="/" className="button-outline" style={styles.buttonOutline}>
                            <HomeIcon />
                            <span>Go Home</span>
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
};

// --- Aesthetically-Calibrated Styles ---
const palette = {
    primary: '#9cdb5f',
    primaryDark: '#8BC94C',
    primaryDarkest: '#5A8C2B',
    light: '#D4EEB9',
    lightest: '#F1F9E8',
    background: '#F8FCF4',
};

const styles: { [key:string]: React.CSSProperties } = {
    // --- THIS IS THE ONLY SECTION WITH CHANGES ---
    container: {
        minHeight: '100vh',
        width: '100vw',
        // The amazing world background image is added here.
        backgroundImage: `url('https://images.unsplash.com/photo-1564053489984-317bbd824344?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '60px', // Space for the fixed header
        boxSizing: 'border-box',
    },
    // This new style creates the overlay that sits between the background and the content.
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(248, 252, 244, 0.9)', // 90% opaque version of your background color
        backdropFilter: 'blur(4px)', // Soft blur effect
        zIndex: 1,
    },
    content: {
        position: 'relative', // Ensures content sits on top of the overlay
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center',
        width: '100%',
        maxWidth: '900px',
    },
    // --- ALL STYLES BELOW THIS LINE ARE UNCHANGED ---
    banner: {
        backgroundColor: palette.lightest,
        borderRadius: '50px',
        padding: '12px 30px',
        marginBottom: '40px',
        transform: 'rotate(-4deg)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        border: `2px dashed ${palette.light}`,
    },
    bannerText: {
        margin: 0,
        fontFamily: "'Fredoka One', cursive",
        fontSize: 'clamp(1.2rem, 4vw, 1.7rem)',
        fontWeight: '400',
        color: palette.primaryDarkest,
    },
    illustrationWrapper: {
        position: 'relative',
        marginBottom: '40px',
        animation: 'float 6s ease-in-out infinite',
    },
    earth: {
        position: 'relative',
        width: '240px',
        height: '240px',
        borderRadius: '50%',
        backgroundColor: palette.primary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `6px solid #fff`,
        boxShadow: `0 10px 30px rgba(156, 219, 95, 0.4), inset 0 0 10px rgba(0,0,0,0.1)`,
        overflow: 'hidden',
    },
    number4: {
        position: 'absolute',
        fontSize: '120px',
        fontWeight: '900',
        fontFamily: "'Nunito', sans-serif",
        color: palette.light,
        left: '15px',
        textShadow: `2px 2px 0px ${palette.primaryDarkest}`,
        transform: 'rotate(-12deg)',
    },
    number0: {
        fontSize: '150px',
        fontWeight: '900',
        fontFamily: "'Nunito', sans-serif",
        color: '#fff',
        textShadow: `3px 3px 0px ${palette.primaryDarkest}`,
        zIndex: 2,
    },
    number4Second: {
        position: 'absolute',
        fontSize: '120px',
        fontWeight: '900',
        fontFamily: "'Nunito', sans-serif",
        color: palette.light,
        right: '15px',
        textShadow: `2px 2px 0px ${palette.primaryDarkest}`,
        transform: 'rotate(12deg)',
    },
    sproutCharacter: {
        position: 'absolute',
        top: '20px',
        fontSize: '40px',
        zIndex: 3,
        transform: 'rotate(-10deg)',
        animation: 'sprout-peek 3s ease-in-out infinite alternate',
    },
    message: {
        fontFamily: "'Quicksand', sans-serif",
        fontSize: '1.2rem',
        color: '#374151',
        marginBottom: '40px',
        maxWidth: '450px',
        lineHeight: '1.6',
        fontWeight: 600,
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    buttonGreen: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '14px 28px',
        fontSize: '16px',
        fontWeight: '600',
        color: palette.primaryDarkest,
        backgroundColor: palette.primary,
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        boxShadow: `0 4px 15px -5px ${palette.primary}`,
    },
    buttonOutline: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 26px',
        fontSize: '16px',
        fontWeight: '600',
        color: palette.primaryDarkest,
        backgroundColor: '#fff',
        border: `2px solid ${palette.light}`,
        borderRadius: '12px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
    },
};

// --- Animations and Global Hover Styles ---
const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@900&family=Quicksand:wght@600&display=swap');

    body { margin: 0; }

    .button-green:hover {
        background-color: ${palette.primaryDark};
        transform: translateY(-3px);
        box-shadow: 0 7px 20px -5px ${palette.primary};
    }
    .button-outline:hover {
        border-color: ${palette.light};
        background-color: ${palette.lightest};
        transform: translateY(-3px);
    }

    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
        100% { transform: translateY(0px); }
    }
    
    @keyframes sprout-peek {
        from { transform: translateY(5px) rotate(-10deg); }
        to { transform: translateY(0) rotate(5deg); }
    }
`;

if (!document.getElementById('green-growth-error-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'green-growth-error-styles';
    styleSheet.innerHTML = globalStyles;
    document.head.appendChild(styleSheet);
}

export default ErrorPage;