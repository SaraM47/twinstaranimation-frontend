import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ShoppingCart,
  BarChart3,
  Package,
  BookOpen,
  FileText,
  Film,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { getCreatorDashboard } from "../../../api/endpoints/creator.api";

export default function CreatorDashboardPage() {
  // Fetch dashboard data from backend
  const { data, isLoading } = useQuery({
    queryKey: ["creator-dashboard"], // Unique cache key
    queryFn: getCreatorDashboard, // API function
  });

  // Show loading state while data is being fetched
  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  // Statistics cards shown in dashboard overview
  const stats = [
    {
      label: "Revenue",
      value: `${data.totalRevenue} USD`,
      icon: DollarSign,
      accent: "from-violet-500/15 to-fuchsia-500/10",
    },
    {
      label: "Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      accent: "from-sky-500/15 to-cyan-500/10",
    },
    {
      label: "Sales",
      value: data.totalSales,
      icon: BarChart3,
      accent: "from-emerald-500/15 to-green-500/10",
    },
    {
      label: "Products",
      value: data.totalProducts,
      icon: Package,
      accent: "from-orange-500/15 to-amber-500/10",
    },
    {
      label: "Series",
      value: data.totalSeries,
      icon: BookOpen,
      accent: "from-pink-500/15 to-rose-500/10",
    },
    {
      label: "Chapters",
      value: data.totalChapters,
      icon: FileText,
      accent: "from-indigo-500/15 to-violet-500/10",
    },
  ];

  // Quick-access navigation cards for creator modules
  const modules = [
    {
      title: "Products",
      description:
        "Manage your store products, pricing and visual presentation.",
      to: "/creator/products",
      icon: Package,
    },
    {
      title: "Series",
      description: "Organize your comic and animation series structure.",
      to: "/creator/series",
      icon: BookOpen,
    },
    {
      title: "Chapters",
      description: "Build chapter flow and keep your content structured.",
      to: "/creator/chapters",
      icon: FileText,
    },
    {
      title: "Media",
      description: "Add pages, videos and external links to each chapter.",
      to: "/creator/media",
      icon: Film,
    },
  ];

  return (
    // Main page wrapper
    <div className="space-y-8">
      {/* Hero section */}
      <section className="overflow-hidden rounded-tl-3xl rounded-tr-3xl border border-gray-200 bg-white shadow-sm">
        <div className="relative px-6 py-7 md:px-8 md:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]" />

          {/* Decorative gradient background */}
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                <Sparkles size={14} />
                Creator behind the studio
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                Welcome to Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 md:text-base">
                Overview of technical animation and comics workspace. Track
                performance, manage content and move quickly between products,
                series, chapters and media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics overview section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
          <p className="mt-1 text-md text-gray-500">
            Live summary of your creator business and content structure.
          </p>
        </div>

        {/* Statistics grid */}
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200"
              >
                {/* Stat icon with gradient background */}
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${item.accent}`}
                >
                  <Icon
                    size={22}
                    className="text-gray-900"
                    aria-hidden="true"
                  />
                </div>

                {/* Label */}
                <dt className="text-sm font-medium text-gray-500">
                  {item.label}
                </dt>

                {/* Value */}
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      {/* Detailed module cards section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Workspace modules
          </h2>
          <p className="mt-1 text-md text-gray-500">
            Jump directly into the area you want to manage.
          </p>
        </div>

        {/* Larger module cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className="group rounded-3xl border border-gray-200 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg hover:bg-white"
              >
                {/* Top row with icon and arrow */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="mt-1 text-gray-400 transition group-hover:text-gray-900"
                  />
                </div>

                {/* Module title */}
                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                {/* Module description */}
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
