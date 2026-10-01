"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "~/app/(account)/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { http } from "~/shared/http";
import type { Notifications } from "./types";

export function NotificationsBell() {
  const { user } = useAuth();
  const client = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const key = ["notifications", user?.id];
  const { data, isError } = useQuery({ queryKey: key, enabled: !!user,
    queryFn: async () => (await http.get<Notifications>("/notifications")).data });
  const read = useMutation({ mutationFn: (id: number) => http.patch(`/notifications/${id}/read`),
    onSuccess: () => client.invalidateQueries({ queryKey: key }) });

  useEffect(() => {
    if (!user) return;
    const source = new EventSource(`${(http.defaults.baseURL ?? "").replace(/\/$/, "")}/notifications/stream`, { withCredentials: true });
    source.onopen = () => {
      setConnected(true);
      void client.invalidateQueries({ queryKey: ["orders", user.id] });
      void client.invalidateQueries({ queryKey: ["notifications", user.id] });
    };
    source.addEventListener("notifications", event => {
      const data = JSON.parse((event as MessageEvent).data) as Notifications;
      client.setQueryData(["notifications", user.id], data);
      void client.invalidateQueries({ queryKey: ["orders", user.id] });
      void client.invalidateQueries({ queryKey: ["consolidated_products"] });
      void client.invalidateQueries({ queryKey: ["products", "mine"] });
      void client.invalidateQueries({ queryKey: ["cart", user.id] });
    });
    // EventSource reconnects automatically with cookies; a new connection receives
    // the durable snapshot, including notifications created while offline.
    source.onerror = () => {
      setConnected(false);
      // The shared HTTP client renews an expired access cookie before EventSource retries.
      void http.get("/account/me").catch(() => undefined);
    };
    return () => source.close();
  }, [client, user]);

  if (!user) return null;
  const base = user.role === "producer" ? "/panel/orders" : "/orders";
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger render={<Button variant="ghost" aria-label={`Notificações: ${data?.unread ?? 0} por ler`} />}>
      <Bell /><span>{data?.unread ?? 0}</span>
    </SheetTrigger>
    <SheetContent className="overflow-y-auto">
      <SheetHeader><SheetTitle>Notificações</SheetTitle></SheetHeader>
      <p className="px-6 text-xs text-zinc-500" role="status">{connected ? "Atualizações em tempo real" : "A restabelecer a ligação…"}</p>
      {isError && <p className="px-6 text-red-700">Não foi possível carregar as notificações. Verifique a sessão.</p>}
      <div className="space-y-3 p-6">
        {data?.items.length === 0 && <p>Nenhuma notificação.</p>}
        {data?.items.map(item => <div key={item.id} className={`rounded-xl border p-3 ${item.readAt ? "" : "border-emerald-300 bg-emerald-50"}`}>
          <Link href={`${base}/${item.orderId}`} onClick={() => { setOpen(false); if (!item.readAt) read.mutate(item.id); }} className="font-medium">{item.title}</Link>
          <p className="mt-1 text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString("pt-AO")}</p>
          {!item.readAt && <Button size="sm" variant="ghost" disabled={read.isPending} onClick={() => read.mutate(item.id)}>Marcar como lida</Button>}
        </div>)}
      </div>
    </SheetContent>
  </Sheet>;
}
