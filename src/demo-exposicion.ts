export function calculateOrderTotal(basePrice: number, shippingFee: number): number {
  return basePrice + shippingFee;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
}

export interface CustomerAccount {
  readonly accountId: string;
  fullName: string;
  emailAddress: string;
  shippingAddress?: DeliveryAddress;
}

export function extractPostalCodeSafely(customer?: CustomerAccount): string {
  return customer?.shippingAddress?.postalCode ?? 'CODIGO_POSTAL_NO_ESPECIFICADO';
}

export function updateUserProfile(
  existingProfile: CustomerAccount,
  profileUpdates: Partial<Omit<CustomerAccount, 'accountId'>>
): CustomerAccount {
  return {
    ...existingProfile,
    ...profileUpdates,
  };
}

export type PaymentTransactionResult =
  | { status: 'SUCCESS'; transactionReference: string; completedAt: string }
  | { status: 'REJECTED'; failureReason: string; retryAllowed: boolean }
  | { status: 'PENDING'; qrPaymentUrl: string };

export function resolvePaymentStatusMessage(result: PaymentTransactionResult): string {
  switch (result.status) {
    case 'SUCCESS':
      return `Pago aprobado. Referencia: ${result.transactionReference}`;

    case 'REJECTED':
      return `Pago declinado: ${result.failureReason}`;

    case 'PENDING':
      return `Esperando confirmacion via QR: ${result.qrPaymentUrl}`;

    default:
      const exhaustiveCheck: never = result;
      return exhaustiveCheck;
  }
}

export interface ApiResponseEnvelope<TData> {
  isSuccess: boolean;
  serverTimestamp: number;
  payload: TData;
}

export async function fetchTypedApiEndpoint<TModel>(
  requestEndpointUrl: string
): Promise<ApiResponseEnvelope<TModel>> {
  const simulatedResponse = await fetch(requestEndpointUrl);
  const jsonEnvelope = (await simulatedResponse.json()) as ApiResponseEnvelope<TModel>;
  return jsonEnvelope;
}
