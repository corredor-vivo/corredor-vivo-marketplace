import { OrderDetail } from "~/shared/sales/orders";
export default async function OrderPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  return <OrderDetail id={id} created={query.created === "1"} />;
}
