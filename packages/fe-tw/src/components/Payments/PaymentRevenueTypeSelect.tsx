"use client";

type PaymentRevenueTypeSelectProps = {
  revenueType: string;
  setRevenueType: (value: string) => void;
};

export function PaymentRevenueTypeSelect({ revenueType, setRevenueType }: PaymentRevenueTypeSelectProps) {
  return (
    <div>
      <label className="block mb-1 font-semibold" htmlFor="revenueType">
        Revenue Type
      </label>
      <select
        id="revenueType"
        value={revenueType}
        onChange={(e) => setRevenueType(e.target.value)}
        className="select select-bordered w-full"
      >
        <option value="rental">Rental</option>
        <option value="parking">Parking Fees</option>
        <option value="advertising">Advertising Revenue</option>
        <option value="service">Service Charges</option>
      </select>
    </div>
  );
}
