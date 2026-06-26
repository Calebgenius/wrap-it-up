import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

const GOLD = "#C9A96E"; const DARK = "#1E1A16"; const MUTED = "#6B5F50"; const BG = "#FAF7F2";

const OCCASIONS = ["Birthday","Anniversary","Wedding / Introduction","Baby shower","Graduation","Corporate gift","Other"];
const SERVICES  = ["Gift wrapping only","Wrapping + delivery","Hamper curation","Full event package","Corporate gifting"];

export default function NewOrderScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", phone: "", occasion: "", service: "", message: "", price: "",
  });

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  async function save() {
    if (!form.customer_name || !form.phone) {
      Alert.alert("Required", "Please enter customer name and phone number.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("orders").insert([{
      customer_name: form.customer_name,
      phone: form.phone,
      occasion: form.occasion,
      service: form.service,
      message: form.message,
      price: form.price ? parseInt(form.price) : null,
      status: "new",
    }]);

    if (!error) {
      await supabase.from("customers").upsert(
        [{ name: form.customer_name, phone: form.phone }],
        { onConflict: "phone", ignoreDuplicates: false }
      );
      Alert.alert("Order saved! 🎁", `Order for ${form.customer_name} has been created.`, [
        { text: "OK", onPress: () => router.back() }
      ]);
    } else {
      Alert.alert("Error", "Could not save order. Please try again.");
    }
    setSaving(false);
  }

  const Field = ({ label, placeholder, keyName, keyboardType = "default", multiline = false }: any) => (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, multiline && s.inputMulti]}
        placeholder={placeholder}
        placeholderTextColor="rgba(107,95,80,0.4)"
        value={form[keyName as keyof typeof form]}
        onChangeText={v => set(keyName, v)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  const Select = ({ label, keyName, options }: { label: string; keyName: string; options: string[] }) => (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={s.chips}>
          {options.map(o => {
            const active = form[keyName as keyof typeof form] === o;
            return (
              <TouchableOpacity
                key={o}
                style={[s.chip, active && s.chipActive]}
                onPress={() => set(keyName, o)}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{o}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={s.root} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.card}>
          <Text style={s.section}>Customer details</Text>
          <Field label="Full name *" placeholder="e.g. Amara Nakato" keyName="customer_name" />
          <Field label="WhatsApp number *" placeholder="+256 ..." keyName="phone" keyboardType="phone-pad" />
        </View>

        <View style={s.card}>
          <Text style={s.section}>Order details</Text>
          <Select label="Occasion" keyName="occasion" options={OCCASIONS} />
          <Select label="Service" keyName="service" options={SERVICES} />
          <Field label="Price (UGX)" placeholder="e.g. 25000" keyName="price" keyboardType="numeric" />
          <Field label="Notes / special requests" placeholder="Gift size, colours, delivery address..." keyName="message" multiline />
        </View>

        <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={s.saveBtnText}>{saving ? "Saving..." : "Save Order"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  card: {
    backgroundColor: "#fff", margin: 12, marginBottom: 0,
    borderRadius: 12, padding: 16,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.2)",
  },
  section: { fontSize: 13, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 },
  field: { marginBottom: 16 },
  label: { fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
  input: {
    backgroundColor: BG, borderWidth: 1, borderColor: "rgba(201,169,110,0.25)",
    borderRadius: 8, padding: 12, fontSize: 14, color: DARK,
  },
  inputMulti: { height: 90, textAlignVertical: "top" },
  chips: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 0.5, borderColor: "rgba(201,169,110,0.3)", backgroundColor: BG,
  },
  chipActive: { backgroundColor: DARK, borderColor: DARK },
  chipText: { fontSize: 12, color: MUTED },
  chipTextActive: { color: "#fff" },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: GOLD, margin: 12, padding: 16, borderRadius: 12,
  },
  saveBtnText: { fontSize: 15, color: "#fff", fontWeight: "500", letterSpacing: 0.5 },
});