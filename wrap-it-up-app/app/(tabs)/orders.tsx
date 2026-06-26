import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Linking, Alert, TextInput
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase, Order } from "../../lib/supabase";

const GOLD = "#C9A96E"; const DARK = "#1E1A16"; const MUTED = "#6B5F50"; const BG = "#FAF7F2";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  new:         { bg: "rgba(91,141,239,0.12)",  text: "#185FA5", label: "New" },
  in_progress: { bg: "rgba(232,148,58,0.12)",  text: "#854F0B", label: "In Progress" },
  wrapped:     { bg: "rgba(201,169,110,0.15)", text: "#A07840", label: "Wrapped" },
  delivered:   { bg: "rgba(76,175,130,0.12)",  text: "#0F6E56", label: "Delivered" },
};

const FILTERS = ["All", "New", "In Progress", "Wrapped", "Delivered"];

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "All") q = q.eq("status", filter.toLowerCase().replace(" ", "_"));
    const { data } = await q;
    setOrders(data || []);
    setLoading(false);
    setRefreshing(false);
  }, [filter]);

  useEffect(() => { load(); }, [filter]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const filtered = orders.filter(o =>
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.phone.includes(search)
  );

  function confirmStatus(order: Order) {
    const options = ["New", "In Progress", "Wrapped", "Delivered", "Cancel"];
    Alert.alert(`Update — ${order.customer_name}`, "Change status to:", options.map((o, i) => ({
      text: o,
      style: i === options.length - 1 ? "cancel" : "default",
      onPress: i < options.length - 1
        ? async () => { await supabase.from("orders").update({ status: o.toLowerCase().replace(" ", "_") }).eq("id", order.id); load(); }
        : undefined,
    })));
  }

  async function deleteOrder(id: string) {
    Alert.alert("Delete order?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await supabase.from("orders").delete().eq("id", id); load(); } },
    ]);
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Orders</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => router.push("/new-order")}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={16} color={MUTED} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Search name or phone..."
          placeholderTextColor="rgba(107,95,80,0.5)"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* FILTER TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersScroll}>
        <View style={s.filters}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, filter === f && s.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterText, filter === f && s.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView
        style={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GOLD} />}
      >
        <Text style={s.count}>{filtered.length} order{filtered.length !== 1 ? "s" : ""}</Text>

        {loading ? <Text style={s.emptyText}>Loading...</Text>
        : filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🎁</Text>
            <Text style={s.emptyText}>No orders found</Text>
          </View>
        ) : filtered.map(order => {
          const st = STATUS_COLORS[order.status] || STATUS_COLORS.new;
          return (
            <View key={order.id} style={s.card}>
              <View style={s.cardTop}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>
                    {order.customer_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.name}>{order.customer_name}</Text>
                  <Text style={s.meta}>{order.service}</Text>
                  <Text style={s.meta}>{order.occasion} · {fmt(order.created_at)}</Text>
                  {order.price ? <Text style={s.price}>UGX {order.price.toLocaleString()}</Text> : null}
                </View>
                <TouchableOpacity style={[s.badge, { backgroundColor: st.bg }]} onPress={() => confirmStatus(order)}>
                  <Text style={[s.badgeText, { color: st.text }]}>{st.label}</Text>
                </TouchableOpacity>
              </View>

              {order.message ? (
                <Text style={s.note} numberOfLines={2}>📝 {order.message}</Text>
              ) : null}

              <View style={s.cardActions}>
                <TouchableOpacity style={s.actionBtn}
                  onPress={() => Linking.openURL(`https://wa.me/${order.phone.replace(/\D/g, "")}`)}>
                  <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
                  <Text style={[s.actionText, { color: "#25D366" }]}>{order.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtn} onPress={() => confirmStatus(order)}>
                  <Ionicons name="swap-horizontal-outline" size={14} color={GOLD} />
                  <Text style={[s.actionText, { color: GOLD }]}>Status</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtn} onPress={() => deleteOrder(order.id)}>
                  <Ionicons name="trash-outline" size={14} color="#E05C5C" />
                  <Text style={[s.actionText, { color: "#E05C5C" }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: DARK, paddingTop: 56, paddingBottom: 16,
    paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  headerTitle: { fontSize: 22, color: "#fff", fontWeight: "400" },
  addBtn: { width: 36, height: 36, backgroundColor: GOLD, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  searchWrap: {
    flexDirection: "row", alignItems: "center",
    margin: 12, backgroundColor: "#fff", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.2)",
  },
  searchInput: { flex: 1, fontSize: 14, color: DARK },
  filtersScroll: { maxHeight: 48 },
  filters: { flexDirection: "row", paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.3)", backgroundColor: "#fff",
  },
  filterBtnActive: { backgroundColor: DARK, borderColor: DARK },
  filterText: { fontSize: 12, color: MUTED },
  filterTextActive: { color: "#fff" },
  scroll: { flex: 1 },
  count: { fontSize: 12, color: MUTED, paddingHorizontal: 16, paddingVertical: 6 },
  card: {
    backgroundColor: "#fff", borderRadius: 10, marginHorizontal: 12, marginBottom: 10,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.2)", overflow: "hidden",
  },
  cardTop: { flexDirection: "row", padding: 14, gap: 10, alignItems: "flex-start" },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F0E8", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 12, color: GOLD, fontWeight: "500" },
  name: { fontSize: 14, color: DARK, fontWeight: "500" },
  meta: { fontSize: 12, color: MUTED, marginTop: 1 },
  price: { fontSize: 12, color: GOLD, marginTop: 3 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  note: { fontSize: 12, color: MUTED, paddingHorizontal: 14, paddingBottom: 10 },
  cardActions: {
    flexDirection: "row", borderTopWidth: 0.5,
    borderTopColor: "rgba(201,169,110,0.1)",
  },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 4, paddingVertical: 10,
  },
  actionText: { fontSize: 12 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 14, color: MUTED, textAlign: "center", padding: 20 },
});