export const metadata = {
    title: 'Site Unavailable',
    robots: 'noindex, nofollow',
};

export default function SuspendedPage() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Site Unavailable</title>
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #f9fafb;
                        color: #111827;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                    }
                    .card {
                        background: #fff;
                        border: 1px solid #e5e7eb;
                        border-radius: 1rem;
                        padding: 3rem 2.5rem;
                        max-width: 420px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 4px 24px rgba(0,0,0,0.07);
                    }
                    .icon {
                        font-size: 2.5rem;
                        margin-bottom: 1.25rem;
                    }
                    h1 {
                        font-size: 1.375rem;
                        font-weight: 700;
                        margin-bottom: 0.75rem;
                        color: #111827;
                    }
                    p {
                        font-size: 0.9375rem;
                        color: #6b7280;
                        line-height: 1.6;
                    }
                    .divider {
                        border: none;
                        border-top: 1px solid #f3f4f6;
                        margin: 1.75rem 0;
                    }
                    .contact {
                        font-size: 0.875rem;
                        color: #9ca3af;
                    }
                    .contact a {
                        color: #374151;
                        font-weight: 600;
                        text-decoration: none;
                    }
                `}</style>
            </head>
            <body>
                <div className="card">
                    <div className="icon">🔒</div>
                    <h1>Site Temporarily Unavailable</h1>
                    <p>This site is currently undergoing maintenance or has been temporarily suspended. We&apos;ll be back shortly.</p>
                    <hr className="divider" />
                    <p className="contact">
                        Need access restored?{' '}
                        <a href="mailto:hello@ppdev.in">Contact support</a>
                    </p>
                </div>
            </body>
        </html>
    );
}
