import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, ListChecks } from "lucide-react"; 
import type { ReportDTO } from "../../api";

export const StatusCards = ({ processes }: { processes: ReportDTO[] }) => {
  const cardData = [
    {
      title: 'Approved',
      value: processes.filter(p => p.currentStatus === 'APPROVED').length,
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
      border: "border-green-500"
    },
    {
      title: 'Pending',
      value: processes.filter(p => p.currentStatus === 'PENDING').length,
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      bg: "bg-yellow-50",
      border: "border-yellow-500"
    },
    {
      title: 'Rejected',
      value: processes.filter(p => p.currentStatus === 'REJECTED').length,
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      bg: "bg-red-50",
      border: "border-red-500"
    },
    {
      title: 'Total',
      value: processes.length,
      icon: <ListChecks className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
      border: "border-blue-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cardData.map((card, index) => (
        <Card
          key={index}
          className={`flex flex-col justify-between min-w-[200px] ${card.bg} border-l-4 ${card.border} transition-all hover:scale-[1.02] hover:shadow-md`}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-700">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
