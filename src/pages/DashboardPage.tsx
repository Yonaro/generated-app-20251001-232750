import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestsTable } from '@/components/dashboard/RequestsTable';
import { useAppStore } from '@/lib/store';
import { DollarSign, Clock, CheckCircle, XCircle, LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
interface KpiCardProps {
  title: string;
  value: number;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  isCurrency?: boolean;
}
export function DashboardPage() {
  const { requests, currentUser } = useAppStore();
  const kpiData: { [key in 'requester' | 'manager' | 'finance']: KpiCardProps[] } = {
    requester: [
      { title: 'Pending Requests', value: requests.filter(r => r.requesterId === currentUser?.id && r.status === 'pending').length, icon: Clock },
      { title: 'Approved Requests', value: requests.filter(r => r.requesterId === currentUser?.id && r.status === 'approved').length, icon: CheckCircle },
      { title: 'Total Spent (USD)', value: requests.filter(r => r.requesterId === currentUser?.id && r.status === 'disbursed' && r.currency === 'USD').reduce((sum, r) => sum + r.amount, 0), icon: DollarSign, isCurrency: true },
    ],
    manager: [
      { title: 'Pending Approval', value: requests.filter(r => r.status === 'pending').length, icon: Clock },
      { title: 'Total Approved', value: requests.filter(r => r.status === 'approved' || r.status === 'disbursed').length, icon: CheckCircle },
      { title: 'Total Rejected', value: requests.filter(r => r.status === 'rejected').length, icon: XCircle },
    ],
    finance: [
      { title: 'Awaiting Disbursement', value: requests.filter(r => r.status === 'approved').length, icon: Clock },
      { title: 'Total Disbursed (USD)', value: requests.filter(r => r.status === 'disbursed' && r.currency === 'USD').reduce((sum, r) => sum + r.amount, 0), icon: DollarSign, isCurrency: true },
      { title: 'Total Requests', value: requests.length, icon: DollarSign },
    ],
  };
  const currentKpis = currentUser ? kpiData[currentUser.role] : [];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Welcome back, {currentUser?.name}!</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentKpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</CardTitle>
                <kpi.icon className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {kpi.isCurrency ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(kpi.value) : kpi.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <RequestsTable />
      </motion.div>
    </div>
  );
}