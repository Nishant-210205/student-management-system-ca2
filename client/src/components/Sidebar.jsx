import {
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  GraduationCap,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={22} strokeWidth={1.8} />
        </div>

        <div>
          <h2>StudentHub</h2>
          <p>Manage. Learn. Grow.</p>
        </div>
      </div>

      <nav className="sidebar-nav">

        <button className="nav-item active">
          <LayoutDashboard size={18} strokeWidth={1.8} />
          Dashboard
        </button>

        <button className="nav-item">
          <Users size={18} strokeWidth={1.8} />
          Students
        </button>

        <button className="nav-item">
          <UserPlus size={18} strokeWidth={1.8} />
          Add Student
        </button>

        <button className="nav-item">
          <BarChart3 size={18} strokeWidth={1.8} />
          Reports
        </button>

        <button className="nav-item">
          <Settings size={18} strokeWidth={1.8} />
          Settings
        </button>

      </nav>

      <div className="sidebar-quote">
        <p>
          “Education builds
          <br />
          brighter
          <br />
          tomorrows.”
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;