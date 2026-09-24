import { toast } from "sonner";

// Hashback M-Pesa Integration Service
// Same flow/credentials as:
// C:\Users\APEX INFINITY\Downloads\groupsupermarket-master (4)\groupsupermarket-master\src\lib\mpesa.ts
// ⚠️ TESTING ONLY — credentials hardcoded, env vars fully bypassed
const HASHBACK_API_BASE_URL = "/api/hashback";
const HASHBACK_API_KEY = "9851f07892796e5ab74e04b89e6d623e15363438b39213ec4224fa2805c746f5";
const HASHBACK_ACCOUNT_ID = "HP464530";

type HashbackInitiateResponse = {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  CustomerMessage?: string;
};

type HashbackStatusResponse = {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResultCode?: string;
  ResultDesc?: string;
};

export function isValidPhoneNumber(phone: string): boolean {
  const formatted = MpesaService.formatPhone(phone);
  return /^254[17]\d{8}$/.test(formatted);
}

export class MpesaService {
  static formatPhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) cleaned = "254" + cleaned.substring(1);
    if (cleaned.startsWith("+")) cleaned = cleaned.substring(1);
    if (!cleaned.startsWith("254")) cleaned = "254" + cleaned;
    return cleaned;
  }

  // Initiate STK Push via Hashback
  static async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    referencePrefix: string = "KCC"
  ): Promise<{ success: boolean; checkoutRequestId?: string; error?: string }> {
    try {
      const formattedPhone = this.formatPhone(phoneNumber);
      const reference = `${referencePrefix}${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const response = await fetch(`${HASHBACK_API_BASE_URL}/initiatestk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: HASHBACK_API_KEY,
          account_id: HASHBACK_ACCOUNT_ID,
          amount: String(Math.round(Number(amount))),
          msisdn: formattedPhone,
          reference,
        }),
      });

      const data: HashbackInitiateResponse | null = await response
        .json()
        .catch(() => null);

      if (!response.ok || !data) {
        console.error("Hashback payment initiation failed:", data);
        return { success: false, error: "Failed to initiate payment" };
      }

      if (String(data.ResponseCode) !== "0") {
        console.error("Hashback initiation error:", data);
        return {
          success: false,
          error: data.ResponseDescription || "Failed to initiate payment",
        };
      }

      const checkoutId = data.CheckoutRequestID;
      if (!checkoutId) {
        return {
          success: false,
          error: "Payment initiated but missing CheckoutRequestID",
        };
      }

      toast.success("STK Push sent! Check your phone and enter PIN.");
      return { success: true, checkoutRequestId: checkoutId };
    } catch (error) {
      console.error("Hashback STK Push Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to initiate payment",
      };
    }
  }

  static async checkTransactionStatus(
    checkoutRequestId: string
  ): Promise<HashbackStatusResponse> {
    const response = await fetch(`${HASHBACK_API_BASE_URL}/transactionstatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: HASHBACK_API_KEY,
        account_id: HASHBACK_ACCOUNT_ID,
        checkoutid: checkoutRequestId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Status check failed: ${response.status} ${errorText}`.trim());
    }

    return response.json();
  }

  static async getPaymentStatus(
    checkoutRequestId: string
  ): Promise<"completed" | "failed" | "pending"> {
    const status = await this.checkTransactionStatus(checkoutRequestId);

    // Hashback: ResultCode === "0" → payment completed successfully.
    if (String(status.ResultCode) === "0") return "completed";

    const desc = String(status.ResultDesc ?? status.ResponseDescription ?? "").toLowerCase();
    if (
      desc.includes("cancel") ||
      desc.includes("fail") ||
      desc.includes("insufficient") ||
      desc.includes("reject")
    ) {
      return "failed";
    }

    return "pending";
  }
}

