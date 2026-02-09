import Card from '@/components/Card/page'
import { Icons } from '@/lib/icons'
import CMSLayout from '@/components/Layout/AdminCMSLayout'

const stats = [
  { title: 'Total Users', value: '1,234', change: '+12%', icon: Icons.Users, color: 'bg-blue-100 text-accent' },
  { title: 'Categories', value: '45', change: '+5%', icon: Icons.Folder, color: 'bg-green-100 text-green-600' },
  { title: 'Total Product', value: '2,543', change: '+8%', icon: Icons.FileText, color: 'bg-purple-100 text-purple-600' },
  { title: 'Active Sessions', value: '89', change: '-2%', icon: Icons.Users, color: 'bg-orange-100 text-orange-600' },
]

const recentActivities = [
  { user: 'John Doe', action: 'created a new post', time: '2 min ago' },
  { user: 'Jane Smith', action: 'updated category settings', time: '15 min ago' },
  { user: 'Bob Johnson', action: 'deleted a user', time: '1 hour ago' },
  { user: 'Alice Williams', action: 'uploaded new media', time: '2 hours ago' },
]

export default function Home() {
  return (
    <CMSLayout>
      <div className="space-y-6 bg-background">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary">{stat.title}</p>
                    <p className="text-2xl font-bold text-primary mt-2">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card title="Recent Activities">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-background rounded-lg">
                    <div>
                      <p className="font-medium text-primary">{activity.user}</p>
                      <p className="text-sm text-secondary">{activity.action}</p>
                    </div>
                    <span className="text-sm text-secondary">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card title="Quick Actions">
              <div className="space-y-3">
                <button className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Add New Post
                </button>
                <button className="w-full border border-accent text-accent py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Invite User
                </button>
                <button className="w-full border border-secondary text-secondary py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Analytics
                </button>
                <button className="w-full border border-secondary text-secondary py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  System Settings
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}