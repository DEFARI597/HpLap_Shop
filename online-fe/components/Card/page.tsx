interface CardProps {
    title: string
    children: React.ReactNode
    actions?: React.ReactNode
}

export default function Card({ title, children, actions }: CardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                {actions && <div>{actions}</div>}
            </div>
            <div className="p-6">{children}</div>
        </div>
    )
}