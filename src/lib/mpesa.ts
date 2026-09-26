import { toast } from "sonner";

// Hashback M-Pesa Integration Service
// Same flow/credentials as:
// C:\Users\APEX INFINITY\Downloads\groupsupermarket-master (4)\groupsupermarket-master\src\lib\mpesa.ts
// ⚠️ TESTING ONLY — credentials hardcoded, env vars fully bypassed
const HASHBACK_API_BASE_URL = "/api/hashback";
const HASHBACK_API_KEY = "5ce253a8b7ec86f1952c445ba676799c089de738665cd1e10b274a087bb5152f";
const HASHBACK_ACCOUNT_ID = "HP935181";

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
    try {
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
        return {
          ResponseCode: "pending",
          ResponseDescription: "Status check pending",
        };
      }

      const data = await response.json().catch(() => null);
      return (
        data || {
          ResponseCode: "pending",
          ResponseDescription: "Status check pending",
        }
      );
    } catch {
      return {
        ResponseCode: "pending",
        ResponseDescription: "Status check pending",
      };
    }
  }

  static async getPaymentStatus(
    checkoutRequestId: string
  ): Promise<"completed" | "failed" | "pending"> {
    const status: any = await this.checkTransactionStatus(checkoutRequestId);

    const resultCode = String(
      status.ResultCode ?? status.resultCode ?? status.result_code ?? ""
    ).trim();
    const statusVal = String(
      status.status ?? status.Status ?? status.state ?? ""
    ).toLowerCase();
    const resultDesc = String(
      status.ResultDesc ?? status.resultDesc ?? status.message ?? ""
    ).toLowerCase();

    // ── Success ──────────────────────────────────────────────────────────────
    if (
      resultCode === "0" ||
      statusVal === "paid" ||
      statusVal === "success" ||
      statusVal === "completed" ||
      resultDesc.includes("success") ||
      resultDesc.includes("processed successfully") ||
      resultDesc.includes("accepted for processing")
    ) {
      return "completed";
    }

    // ── Conclusive failure only (user cancelled, wrong PIN, or insufficient balance)
    // NOTE: 1037 / "user cannot be reached" / "ds timeout" is returned by Hashback immediately while waiting for PIN entry.
    // Do NOT treat it as failure here — it must stay pending until the polling window finishes or user pays.
    if (
      resultDesc.includes("user cannot be reached") ||
      resultDesc.includes("ds timeout")
    ) {
      return "pending";
    }

    const isConclusiveFailure =
      resultCode === "1032" ||
      resultDesc.includes("cancelled by user") ||
      resultDesc.includes("canceled by user") ||
      resultDesc.includes("request cancelled") ||
      resultDesc.includes("insufficient") ||
      resultDesc.includes("wrong pin") ||
      resultDesc.includes("invalid pin") ||
      statusVal === "cancelled" ||
      statusVal === "canceled";

    if (isConclusiveFailure) {
      return "failed";
    }

    return "pending";
  }
}

