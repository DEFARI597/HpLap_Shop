import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Sidebar from '@/components/Sidebar/page'
import Header from '@/components/Header/page'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'CMS Admin Dashboard',
    description: 'Content Management System Admin Panel',
}

export default function CMSLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} flex h-screen`}>
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto bg-background p-6">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}