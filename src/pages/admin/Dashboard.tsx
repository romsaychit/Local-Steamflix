import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  Users,
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Eye,
  ThumbsUp,
  Clock,
  BarChart3,
  Activity,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useUserStore } from '../../store';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, setAuthenticated } = useUserStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Film, label: 'Movies', path: '/admin/movies' },
    { icon: Tv, label: 'TV Shows', path: '/admin/tv-shows' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  // Mock data for dashboard
  const stats = [
    { label: 'Total Views', value: '2.7M', icon: Eye, change: '+12.5%', isPositive: true },
    { label: 'Active Users', value: '95.2K', icon: UserPlus, change: '+8.2%', isPositive: true },
    { label: 'Watch Time', value: '850K hrs', icon: Clock, change: '+24.5%', isPositive: true },
    { label: 'Engagement', value: '64.8%', icon: ThumbsUp, change: '-2.4%', isPositive: false },
  ];

  const recentActivities = [
    { type: 'user_signup', message: 'New user registered', time: '2 minutes ago' },
    { type: 'content_added', message: 'New movie "Inception" added', time: '15 minutes ago' },
    { type: 'report', message: 'Content reported by user', time: '1 hour ago' },
    { type: 'error', message: 'Streaming error detected', time: '2 hours ago' },
  ];

  const topContent = [
    { title: 'The Dark Knight', views: '125K', type: 'movie' },
    { title: 'Breaking Bad', views: '98K', type: 'tv' },
    { title: 'Inception', views: '87K', type: 'movie' },
    { title: 'Stranger Things', views: '76K', type: 'tv' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-200">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-dark-100 w-64 border-r border-gray-200 dark:border-dark-300">
          <div className="flex items-center justify-between mb-6 px-3">
            <div className="flex items-center space-x-3">
              <Film className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">Admin</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 group"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {item.label}
                </span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed bottom-4 right-4 lg:hidden z-40 p-2 rounded-full bg-primary-600 text-white shadow-lg ${
          isSidebarOpen ? 'hidden' : 'block'
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main content */}
      <main className={`p-4 lg:ml-64 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-dark-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                <span className={`text-sm font-medium ${
                  stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="bg-white dark:bg-dark-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Viewing Analytics
              </h2>
              <select className="text-sm border border-gray-300 dark:border-dark-400 rounded-md bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300 py-1.5 pl-3 pr-8">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-dark-300 rounded-lg">
              <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-dark-100 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {activity.type === 'user_signup' && (
                    <UserPlus className="w-5 h-5 text-green-500" />
                  )}
                  {activity.type === 'content_added' && (
                    <Film className="w-5 h-5 text-blue-500" />
                  )}
                  {activity.type === 'report' && (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  {activity.type === 'error' && (
                    <Activity className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{activity.message}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Content */}
          <div className="bg-white dark:bg-dark-100 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
              Top Content
            </h2>
            <div className="space-y-4">
              {topContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-200 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    {content.type === 'movie' ? (
                      <Film className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <Tv className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    )}
                    <span className="text-sm text-gray-800 dark:text-gray-200">{content.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{content.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-dark-100 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/admin/movies')}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
              >
                <Film className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Add Movie</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors">
                <Tv className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Add TV Show</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Manage Users</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors">
                <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
