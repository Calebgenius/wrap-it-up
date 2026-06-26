import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Linking, TextInput
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase, Customer } from "../../lib/supabase";

const GOLD = "#C9A96E"; const DARK = "#1E1A16"; const MUTED = "#6B5F50"; const BG = "#FAF7F2";

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    setCustomers(data || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load(); };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });

  const waMessage = (name: string) =>
    encodeURIComponent(`Hi ${name}! 🎁 Thank you for choosing Wrap It Up. How can we help you today?`);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Customers</Text>
        <Text style={s.headerCount}>{customers.length} total</Text>
      </View>

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

      <ScrollView
        style={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GOLD} />}
      >
        {loading ? <Text style={s.emptyText}>Loading...</Text>
        : filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>👥</Text>
            <Text style={s.emptyText}>No customers yet.{"\n"}They appear automatically when orders are placed.</Text>
          </View>
        ) : filtered.map(c => (
          <View key={c.id} style={s.card}>
            <View style={s.cardRow}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>
                  {c.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{c.name}</Text>
                <Text style={s.meta}>{c.phone}</Text>
                <Text style={s.meta}>Since {fmt(c.created_at)}</Text>
              </View>
              <View style={s.right}>
                <Text style={s.orderCount}>{c.total_orders || 0}</Text>
                <Text style={s.orderLabel}>orders</Text>
              </View>
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.actionBtn}
                onPress={() => Linking.openURL(`https://wa.me/${c.phone.replace(/\D/g, "")}?text=${waMessage(c.name.split(" ")[0])}`)}>
                <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
                <Text style={[s.actionText, { color: "#25D366" }]}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn}
                onPress={() => Linking.openURL(`tel:${c.phone.replace(/\D/g, "")}`)}>
                <Ionicons name="call-outline" size={14} color={GOLD} />
                <Text style={[s.actionText, { color: GOLD }]}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  headerCount: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
  searchWrap: {
    flexDirection: "row", alignItems: "center", margin: 12,
    backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.2)",
  },
  searchInput: { flex: 1, fontSize: 14, color: DARK },
  scroll: { flex: 1 },
  card: {
    backgroundColor: "#fff", borderRadius: 10, marginHorizontal: 12, marginBottom: 10,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.2)", overflow: "hidden",
  },
  cardRow: { flexDirection: "row", padding: 14, gap: 10, alignItems: "center" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F5F0E8", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 14, color: GOLD, fontWeight: "500" },
  name: { fontSize: 14, color: DARK, fontWeight: "500" },
  meta: { fontSize: 12, color: MUTED, marginTop: 2 },
  right: { alignItems: "center" },
  orderCount: { fontSize: 22, color: GOLD, fontWeight: "300" },
  orderLabel: { fontSize: 10, color: MUTED },
  cardActions: { flexDirection: "row", borderTopWidth: 0.5, borderTopColor: "rgba(201,169,110,0.1)" },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  actionText: { fontSize: 12 },
  empty: { alignItems: "center", paddingVertical: 60, paddingHorizontal: 30 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: MUTED, textAlign: "center", lineHeight: 22 },
});