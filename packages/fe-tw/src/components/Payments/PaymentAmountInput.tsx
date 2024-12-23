"use client";

type PaymentAmountInputProps = {
  amount: string;
  setAmount: (value: string) => void;
};

export function PaymentAmountInput({ amount, setAmount }: PaymentAmountInputProps) {
  return (
    <div>
      <label className="block mb-1 font-semibold" htmlFor="amount">
        Amount (USDC)
      </label>
      <input
        id="amount"
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input input-bordered w-full"
        placeholder="Enter amount in USDC"
        required
      />
    </div>
  );
}