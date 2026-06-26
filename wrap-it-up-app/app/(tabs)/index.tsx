import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Linking, Alert
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase, Order } from "../../lib/supabase";

const GOLD = "#C9A96E";
const DARK = "#1E1A16";
const CREAM = "#F5F0E8";
const MUTED = "#6B5F50";
const BG = "#FAF7F2";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  new:         { bg: "rgba(91,141,239,0.12)",  text: "#185FA5", label: "New" },
  in_progress: { bg: "rgba(232,148,58,0.12)",  text: "#854F0B", label: "In Progress" },
  wrapped:     { bg: "rgba(201,169,110,0.15)", text: "#A07840", label: "Wrapped" },
  delivered:   { bg: "rgba(76,175,130,0.12)",  text: "#0F6E56", label: "Delivered" },
};

export default function DashboardScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("orders").select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setOrders(data || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  const onRefresh = () => { setRefreshing(true); load(); };

  const newCount  = orders.filter(o => o.status === "new").length;
  const inProg    = orders.filter(o => o.status === "in_progress").length;
  const delivered = orders.filter(o => o.status === "delivered").length;
  const revenue   = orders.reduce((s, o) => s + (o.price || 0), 0);

  async function updateStatus(id: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);
    load();
  }

  function confirmStatus(order: Order) {
    const options = ["New", "In Progress", "Wrapped", "Delivered", "Cancel"];
    Alert.alert(
      `Update — ${order.customer_name}`,
      "Change order status to:",
      options.map((o, i) => ({
        text: o,
        style: i === options.length - 1 ? "cancel" : "default",
        onPress: i < options.length - 1
          ? () => updateStatus(order.id, o.toLowerCase().replace(" ", "_"))
          : undefined,
      }))
    );
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short" });

  return (
    <View style={s.root}>
      {/* HEADER */}
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>Wrap It Up · Admin</Text>
          <Text style={s.headerTitle}>Good morning ✨</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => router.push("/new-order")}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GOLD} />}
      >
        {/* STATS */}
        <View style={s.statsGrid}>
          {[
            { label: "New Orders", value: newCount, gold: true, sub: "Need attention" },
            { label: "In Progress", value: inProg, gold: false, sub: "Being wrapped" },
            { label: "Delivered", value: delivered, gold: false, sub: "Completed" },
            { label: "Revenue", value: `${(revenue / 1000).toFixed(0)}k`, gold: true, sub: "UGX total" },
          ].map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Text style={s.statLabel}>{stat.label}</Text>
              <Text style={[s.statValue, stat.gold && { color: GOLD }]}>{loading ? "—" : stat.value}</Text>
              <Text style={s.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        {/* RECENT ORDERS */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Recent orders</Text>
            <TouchableOpacity onPress={() => router.push("/orders")}>
              <Text style={s.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={s.emptyText}>Loading...</Text>
          ) : orders.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🎁</Text>
              <Text style={s.emptyText}>No orders yet</Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => router.push("/new-order")}>
                <Text style={s.emptyBtnText}>Create first order</Text>
              </TouchableOpacity>
            </View>
          ) : (
            orders.map((order) => {
              const st = STATUS_COLORS[order.status] || STATUS_COLORS.new;
              return (
                <View key={order.id} style={s.orderCard}>
                  <View style={s.orderRow}>
                    <View style={s.avatar}>
                      <Text style={s.avatarText}>
                        {order.customer_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={s.orderInfo}>
                      <Text style={s.orderName}>{order.customer_name}</Text>
                      <Text style={s.orderService}>{order.service} · {order.occasion}</Text>
                      {order.price ? (
                        <Text style={s.orderPrice}>UGX {order.price.toLocaleString()}</Text>
                      ) : null}
                    </View>
                    <View style={s.orderRight}>
                      <TouchableOpacity
                        style={[s.badge, { backgroundColor: st.bg }]}
                        onPress={() => confirmStatus(order)}
                      >
                        <Text style={[s.badgeText, { color: st.text }]}>{st.label}</Text>
                      </TouchableOpacity>
                      <Text style={s.orderDate}>{fmt(order.created_at)}</Text>
                    </View>
                  </View>
                  {/* WhatsApp row */}
                  <TouchableOpacity
                    style={s.waRow}
                    onPress={() => Linking.openURL(`https://wa.me/${order.phone.replace(/\D/g, "")}`)}
                  >
                    <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
                    <Text style={s.waText}>Chat with {order.customer_name.split(" ")[0]}</Text>
                    <Ionicons name="chevron-forward" size={12} color={MUTED} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => router.push("/new-order")}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: DARK, paddingTop: 56, paddingBottom: 20,
    paddingHorizontal: 20, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
  },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase" },
  headerTitle: { fontSize: 22, color: "#fff", marginTop: 4, fontWeight: "400" },
  addBtn: {
    width: 36, height: 36, backgroundColor: GOLD,
    borderRadius: 18, alignItems: "center", justifyContent: "center",
  },
  scroll: { flex: 1 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 10 },
  statCard: {
    flex: 1, minWidth: "45%", backgroundColor: "#fff",
    borderRadius: 10, padding: 14,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.2)",
  },
  statLabel: { fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  statValue: { fontSize: 32, color: DARK, fontWeight: "300" },
  statSub: { fontSize: 11, color: MUTED, marginTop: 2 },
  section: { paddingHorizontal: 12, paddingBottom: 100 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, color: DARK, fontWeight: "500" },
  seeAll: { fontSize: 12, color: GOLD },
  orderCard: {
    backgroundColor: "#fff", borderRadius: 10, marginBottom: 10,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.2)", overflow: "hidden",
  },
  orderRow: { flexDirection: "row", padding: 14, alignItems: "flex-start" },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: CREAM, alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  avatarText: { fontSize: 13, color: GOLD, fontWeight: "500" },
  orderInfo: { flex: 1 },
  orderName: { fontSize: 14, color: DARK, fontWeight: "500" },
  orderService: { fontSize: 12, color: MUTED, marginTop: 2 },
  orderPrice: { fontSize: 12, color: GOLD, marginTop: 3 },
  orderRight: { alignItems: "flex-end", gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: "500", letterSpacing: 0.5 },
  orderDate: { fontSize: 10, color: MUTED },
  waRow: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    borderTopWidth: 0.5, borderTopColor: "rgba(201,169,110,0.1)",
    backgroundColor: "rgba(37,211,102,0.04)",
  },
  waText: { flex: 1, fontSize: 12, color: MUTED },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 14, color: MUTED, textAlign: "center" },
  emptyBtn: { marginTop: 16, backgroundColor: GOLD, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  emptyBtnText: { color: "#fff", fontSize: 13 },
  fab: {
    position: "absolute", bottom: 80, right: 20,
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: GOLD, alignItems: "center", justifyContent: "center",
    shadowColor: GOLD, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
});