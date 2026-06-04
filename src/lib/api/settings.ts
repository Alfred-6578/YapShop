import { api } from "./client"

export interface SettingResponse {
  key: string
  value: string
  description: string | null
  id: string
  created_at: string
  updated_at: string
}

export interface SettingUpsert {
  key: string
  value: string
  description?: string
}

export async function listSettings(): Promise<SettingResponse[]> {
  return api<SettingResponse[]>("/settings/")
}

export async function bulkUpsertSettings(
  settings: SettingUpsert[],
): Promise<SettingResponse[]> {
  return api<SettingResponse[]>("/settings/bulk", {
    method: "PUT",
    body: { settings },
  })
}

// Available but unused in the settings UI — single PUT is for one-off updates.
export async function upsertSetting(
  setting: SettingUpsert,
): Promise<SettingResponse> {
  return api<SettingResponse>("/settings/", {
    method: "PUT",
    body: setting,
  })
}

export async function deleteSetting(key: string): Promise<void> {
  await api<void>(`/settings/${encodeURIComponent(key)}`, { method: "DELETE" })
}
