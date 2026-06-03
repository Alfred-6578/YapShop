import { api, qs } from "./client"
import type { CustomerResponse, CustomerWritePayload } from "./types"

export interface ListCustomersParams {
  skip?: number
  limit?: number
}

export function listCustomers(
  params: ListCustomersParams = {},
): Promise<CustomerResponse[]> {
  return api<CustomerResponse[]>(`/customers/${qs(params)}`)
}

export function getCustomer(id: string): Promise<CustomerResponse> {
  return api<CustomerResponse>(`/customers/${id}`)
}

export function getCustomerByWhatsapp(
  whatsappNumber: string,
): Promise<CustomerResponse> {
  return api<CustomerResponse>(
    `/customers/whatsapp/${encodeURIComponent(whatsappNumber)}`,
  )
}

export function updateCustomer(
  id: string,
  payload: CustomerWritePayload,
): Promise<CustomerResponse> {
  return api<CustomerResponse>(`/customers/${id}`, {
    method: "PUT",
    body: payload,
  })
}

export async function deleteCustomer(id: string): Promise<void> {
  await api<void>(`/customers/${id}`, { method: "DELETE" })
}
