export type ParsedSms = { amount: number; reference: string };

type SmsPattern = {
  name: string;
  amount: RegExp;
  reference: RegExp;
};

const patterns: SmsPattern[] = [
  {
    name: "MTN_BENIN_1",
    amount: /(\d[\d\s]*)\s*(?:FCFA|CFA|XOF)/i,
    reference: /(?:Ref|Réf|Reference|TxnId|Transaction\s*ID)\s*[:.]?\s*([A-Z0-9]{6,20})/i,
  },
  {
    name: "MTN_BENIN_2",
    amount: /(?:montant|amount|somme)\s*[:.]?\s*(\d+)/i,
    reference: /(?:Code|code|N[°°]?)\s*[:.]?\s*(\w{6,20})/,
  },
  {
    name: "GENERIC_AMOUNT_REF",
    amount: /(\d{3,10})\s*(?:FCFA|CFA|XOF)/i,
    reference: /([A-Z0-9]{8,20})(?:\s|$)/,
  },
];

export function parseMomoSms(text: string): ParsedSms | null {
  const clean = text.replace(/\s+/g, " ").trim();

  for (const pattern of patterns) {
    const amountMatch = clean.match(pattern.amount);
    const refMatch = clean.match(pattern.reference);

    if (amountMatch && refMatch) {
      const amount = parseInt(amountMatch[1].replace(/\s/g, ""), 10);
      const reference = refMatch[1].trim();
      if (!isNaN(amount) && amount > 0 && reference.length >= 4) {
        console.log(`parseMomoSms: matched pattern "${pattern.name}" — ${amount} FCFA, ref ${reference}`);
        return { amount, reference };
      }
    }
  }

  console.log("parseMomoSms: no pattern matched for SMS");
  return null;
}
