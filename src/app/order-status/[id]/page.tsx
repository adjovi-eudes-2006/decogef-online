import { notFound } from "next/navigation";
import { getOrderById } from "@/actions/tickets";
import { OrderStatusView } from "@/components/public/OrderStatusView";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderStatusPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return <OrderStatusView order={order} />;
}
