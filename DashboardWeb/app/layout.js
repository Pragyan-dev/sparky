export const metadata = {
    title: 'Store Manager Dashboard',
    description: 'Real-time retail store management dashboard',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
